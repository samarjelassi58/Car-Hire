#!/usr/bin/env python3
"""Create a standalone HTML dashboard from a Newman JSON report."""

import argparse
import html
import json
import re
import sys
import webbrowser
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


SENSITIVE_KEY = re.compile(r"(password|passwd|secret|token|authorization|api[_-]?key)", re.I)
BEARER_TOKEN = re.compile(r"\bBearer\s+\S+", re.I)
SENSITIVE_ASSIGNMENT = re.compile(
    r"""(?i)(["']?(?:password|passwd|secret|token|authorization|api[_-]?key)["']?\s*[:=]\s*["']?)[^"'&\s,}]+"""
)


def redact_text(value):
    """Redact common credential forms before showing report messages."""
    text = str(value or "")
    text = BEARER_TOKEN.sub("Bearer [REDACTED]", text)
    return SENSITIVE_ASSIGNMENT.sub(r"\1[REDACTED]", text)


def format_url(value):
    if isinstance(value, dict):
        raw = value.get("raw")
        if raw:
            value = raw
        else:
            protocol = value.get("protocol", "")
            host = value.get("host", [])
            path = value.get("path", [])
            if isinstance(host, list):
                host = ".".join(str(part) for part in host)
            if isinstance(path, list):
                path = "/".join(str(part) for part in path)
            value = f"{protocol}://{host}/{path}" if protocol else f"{host}/{path}"
    if isinstance(value, list):
        value = "/".join(str(part) for part in value)

    text = redact_text(value)
    try:
        parts = urlsplit(text)
        if not parts.query:
            return text
        query = urlencode([
            (key, "[REDACTED]" if SENSITIVE_KEY.search(key) else val)
            for key, val in parse_qsl(parts.query, keep_blank_values=True)
        ])
        return urlunsplit((parts.scheme, parts.netloc, parts.path, query, parts.fragment))
    except ValueError:
        return text


def _assertion_result(assertion):
    if isinstance(assertion, str):
        return {"name": redact_text(assertion), "passed": True, "detail": ""}
    if not isinstance(assertion, dict):
        return {"name": "Assertion", "passed": True, "detail": ""}

    error = assertion.get("error")
    passed = not error
    detail = ""
    if isinstance(error, dict):
        detail = error.get("message") or error.get("name") or json.dumps(error, ensure_ascii=False)
    elif error:
        detail = str(error)
    return {
        "name": redact_text(assertion.get("assertion") or assertion.get("name") or "Assertion"),
        "passed": passed,
        "detail": redact_text(detail),
    }


def parse_report(report):
    """Normalize Newman JSON executions into safe, display-ready result data."""
    if not isinstance(report, dict):
        raise ValueError("Le fichier JSON doit contenir un objet.")
    run = report.get("run", report)
    if not isinstance(run, dict):
        raise ValueError("Format non reconnu : objet 'run' absent.")
    executions = run.get("executions")
    if not isinstance(executions, list):
        raise ValueError("Aucune liste 'run.executions' trouvée. Exportez un rapport JSON Newman.")

    results = []
    for execution in executions:
        if not isinstance(execution, dict):
            continue
        item = execution.get("item") or {}
        request = execution.get("request") or {}
        response = execution.get("response") or {}
        assertions = [_assertion_result(item) for item in execution.get("assertions", [])]
        execution_error = execution.get("error") or execution.get("requestError")
        error_text = ""
        if execution_error:
            error_text = (
                execution_error.get("message", str(execution_error))
                if isinstance(execution_error, dict)
                else str(execution_error)
            )
            assertions.append({
                "name": "Erreur de requête",
                "passed": False,
                "detail": redact_text(error_text),
            })

        results.append({
            "name": redact_text(item.get("name") or "Requête sans nom"),
            "method": redact_text(request.get("method") or ""),
            "url": format_url(request.get("url") or ""),
            "status_code": response.get("code"),
            "status_text": redact_text(response.get("status") or ""),
            "response_time": execution.get("responseTime"),
            "assertions": assertions,
            "passed": not any(not assertion["passed"] for assertion in assertions),
            "error": redact_text(error_text),
        })

    failures = run.get("failures") or []
    assertion_count = sum(len(result["assertions"]) for result in results)
    failed_assertion_count = sum(
        not assertion["passed"]
        for result in results
        for assertion in result["assertions"]
    )
    run_stats = run.get("stats") or {}
    assertion_stats = run_stats.get("assertions") or {}
    if not assertion_count and isinstance(assertion_stats, dict):
        assertion_count = assertion_stats.get("total", 0)
        failed_assertion_count = assertion_stats.get("failed", 0)

    timings = run.get("timings") or {}
    duration = None
    if timings.get("started") and timings.get("completed"):
        duration = max(0, timings["completed"] - timings["started"])

    collection = run.get("collection") or {}
    info = collection.get("info") or {}
    return {
        "collection_name": redact_text(info.get("name") or "Rapport Newman"),
        "request_count": len(results),
        "assertion_count": assertion_count,
        "failed_assertion_count": failed_assertion_count,
        "passed_assertion_count": max(0, assertion_count - failed_assertion_count),
        "failure_count": len(failures),
        "duration_ms": duration,
        "results": results,
    }


def _e(value):
    return html.escape(str(value if value is not None else "—"), quote=True)


def render_html(summary):
    """Render a self-contained HTML report without embedding raw request data."""
    passed = summary["failed_assertion_count"] == 0 and summary["failure_count"] == 0
    outcome = "Réussi" if passed else "Échecs détectés"
    outcome_class = "good" if passed else "bad"
    duration = (
        f'{summary["duration_ms"] / 1000:.2f} s'
        if summary["duration_ms"] is not None
        else "—"
    )

    rows = []
    for result in summary["results"]:
        status = "Réussi" if result["passed"] else "Échec"
        row_class = "good" if result["passed"] else "bad"
        code = result["status_code"] or "—"
        status_text = f'{code} {result["status_text"]}'.strip()
        response_time = result["response_time"]
        time_text = f"{response_time} ms" if response_time is not None else "—"
        assertion_html = []
        for assertion in result["assertions"]:
            assertion_class = "good" if assertion["passed"] else "bad"
            assertion_status = "OK" if assertion["passed"] else "ÉCHEC"
            detail = (
                f'<div class="detail">{_e(assertion["detail"])}</div>'
                if assertion["detail"]
                else ""
            )
            assertion_html.append(
                f'<li class="{assertion_class}"><strong>{assertion_status}</strong> '
                f'{_e(assertion["name"])}{detail}</li>'
            )
        if not assertion_html:
            assertion_html.append('<li class="muted">Aucune assertion enregistrée</li>')
        rows.append(
            f"""
            <tr>
              <td><span class="badge {row_class}">{_e(status)}</span></td>
              <td>{_e(result["method"])}</td>
              <td class="request">
                <strong>{_e(result["name"])}</strong>
                <code>{_e(result["url"])}</code>
                <ul class="assertions">{''.join(assertion_html)}</ul>
              </td>
              <td>{_e(status_text)}</td>
              <td>{_e(time_text)}</td>
            </tr>"""
        )

    return f"""<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Résultats API — {_e(summary["collection_name"])}</title>
  <style>
    :root {{ color-scheme: light; font-family: system-ui, Segoe UI, sans-serif; color: #172033; background: #f3f5f9; }}
    body {{ margin: 0; padding: 32px; }}
    main {{ max-width: 1200px; margin: auto; }}
    h1 {{ margin-bottom: 6px; }} .subtitle {{ color: #647084; margin-top: 0; }}
    .cards {{ display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 14px; margin: 24px 0; }}
    .card {{ background: white; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px #17203310; }}
    .card span {{ display: block; color: #647084; font-size: .9rem; }} .card strong {{ display:block; font-size: 1.6rem; margin-top: 6px; }}
    .good {{ color: #087443; }} .bad {{ color: #b42318; }} .muted {{ color:#647084; }}
    .table-wrap {{ overflow-x: auto; background:white; border-radius:12px; box-shadow:0 2px 8px #17203310; }}
    table {{ width:100%; border-collapse:collapse; min-width:850px; }}
    th,td {{ text-align:left; vertical-align:top; border-bottom:1px solid #e8ebf0; padding:14px; }}
    th {{ background:#f9fafb; color:#465268; font-size:.85rem; }}
    code {{ display:block; color:#596579; overflow-wrap:anywhere; margin-top:5px; font-size:.8rem; }}
    .badge {{ display:inline-block; padding:4px 9px; border-radius:99px; font-size:.8rem; font-weight:700; background:#edf0f5; }}
    .badge.good {{ background:#e8f7ef; }} .badge.bad {{ background:#fff0ee; }}
    .assertions {{ padding-left:18px; margin:9px 0 0; font-size:.88rem; }} .assertions li {{ margin:6px 0; }}
    .detail {{ color:#647084; white-space:pre-wrap; overflow-wrap:anywhere; margin:3px 0 0 42px; }}
    footer {{ color:#647084; font-size:.82rem; padding:20px 2px; }}
    @media(max-width:600px) {{ body {{ padding:16px; }} }}
  </style>
</head>
<body>
<main>
  <h1>Résultats des tests API</h1>
  <p class="subtitle">{_e(summary["collection_name"])}</p>
  <section class="cards" aria-label="Résumé">
    <div class="card"><span>Résultat</span><strong class="{outcome_class}">{outcome}</strong></div>
    <div class="card"><span>Requêtes</span><strong>{summary["request_count"]}</strong></div>
    <div class="card"><span>Assertions réussies</span><strong class="good">{summary["passed_assertion_count"]}</strong></div>
    <div class="card"><span>Assertions échouées</span><strong class="{'bad' if summary['failed_assertion_count'] else 'good'}">{summary["failed_assertion_count"]}</strong></div>
    <div class="card"><span>Durée</span><strong>{duration}</strong></div>
  </section>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Résultat</th><th>Méthode</th><th>Requête et assertions</th><th>HTTP</th><th>Durée</th></tr></thead>
      <tbody>{''.join(rows) if rows else '<tr><td colspan="5">Aucune requête trouvée dans le rapport.</td></tr>'}</tbody>
    </table>
  </div>
  <footer>Rapport local généré depuis Newman. Les corps de requête et en-têtes ne sont pas inclus.</footer>
</main>
</body>
</html>"""


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Affiche un rapport JSON Newman dans un tableau de bord HTML local."
    )
    backend_dir = Path(__file__).resolve().parent.parent
    parser.add_argument(
        "json_report", type=Path, nargs="?", default=backend_dir / "postman-results.json",
        help="Fichier JSON exporté par Newman (défaut : back-end/postman-results.json)",
    )
    parser.add_argument(
        "-o", "--output", type=Path, default=backend_dir / "postman-report.html",
        help="Fichier HTML de sortie (défaut : back-end/postman-report.html)",
    )
    parser.add_argument(
        "--open", action="store_true", help="Ouvrir le rapport HTML dans le navigateur"
    )
    args = parser.parse_args(argv)

    try:
        with args.json_report.open("r", encoding="utf-8-sig") as source:
            report = json.load(source)
        summary = parse_report(report)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(render_html(summary), encoding="utf-8")
    except (OSError, json.JSONDecodeError, ValueError) as error:
        print(f"Erreur : {error}", file=sys.stderr)
        return 1

    print(f"Rapport créé : {args.output.resolve()}")
    print(
        f'{summary["request_count"]} requêtes, '
        f'{summary["passed_assertion_count"]} assertions réussies, '
        f'{summary["failed_assertion_count"]} échouées.'
    )
    if args.open:
        webbrowser.open(args.output.resolve().as_uri())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
