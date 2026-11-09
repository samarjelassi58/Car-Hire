import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "scripts" / "view_postman_results.py"
SPEC = importlib.util.spec_from_file_location("view_postman_results", SCRIPT)
viewer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(viewer)


class NewmanReportTests(unittest.TestCase):
    def setUp(self):
        self.report = {
            "run": {
                "collection": {"info": {"name": "Car Hire <API>"}},
                "executions": [
                    {
                        "item": {"name": "Login"},
                        "request": {
                            "method": "POST",
                            "url": {"raw": "http://localhost/login?token=private"},
                        },
                        "response": {"code": 200, "status": "OK"},
                        "responseTime": 12,
                        "assertions": [
                            {"assertion": "Status is 200", "error": None},
                            {
                                "assertion": "No password leaked",
                                "error": {"message": "password: top-secret"},
                            },
                        ],
                    }
                ],
                "failures": [{"error": {"message": "expected password: top-secret"}}],
                "timings": {"started": 1000, "completed": 1120},
            }
        }

    def test_parse_report_summarizes_assertions_and_redacts_secrets(self):
        summary = viewer.parse_report(self.report)
        self.assertEqual(summary["request_count"], 1)
        self.assertEqual(summary["assertion_count"], 2)
        self.assertEqual(summary["passed_assertion_count"], 1)
        self.assertEqual(summary["failed_assertion_count"], 1)
        self.assertIn("token=%5BREDACTED%5D", summary["results"][0]["url"])
        self.assertIn("[REDACTED]", summary["results"][0]["assertions"][1]["detail"])

    def test_rendered_html_escapes_names_and_does_not_include_credentials(self):
        html_report = viewer.render_html(viewer.parse_report(self.report))
        self.assertIn("Car Hire &lt;API&gt;", html_report)
        self.assertNotIn("top-secret", html_report)
        self.assertNotIn("private", html_report)
        self.assertIn("Assertions échouées", html_report)

    def test_rejects_non_newman_json(self):
        with self.assertRaises(ValueError):
            viewer.parse_report({"collection": {}})

    def test_cli_writes_standalone_html(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            temporary_path = Path(temporary_directory)
            input_path = temporary_path / "newman.json"
            output_path = temporary_path / "report.html"
            input_path.write_text(json.dumps(self.report), encoding="utf-8")

            result = viewer.main([str(input_path), "--output", str(output_path)])

            self.assertEqual(result, 0)
            self.assertIn("Résultats des tests API", output_path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
