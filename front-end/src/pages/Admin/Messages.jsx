import AdminLayout from "../../components/AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../app/redux/thunks/messageThunks";


const Avatar = ({ firstName = "", lastName = "" }) => {
  const initials = `${(firstName[0] || "").toUpperCase()}${(lastName[0] || "").toUpperCase()}`.trim() || "U";
  return (
    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
      {initials}
    </div>
  );
};

const Messages = () => {
  const dispatch = useDispatch();
  const { messages = [], loading = false, error = null } = useSelector((s) => s.message || {});
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((m) => {
      const fullName = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
      const email = (m.email || "").toLowerCase();
      const subject = (m.messageObject || "").toLowerCase();
      const body = (m.message || "").toLowerCase();
      return fullName.includes(q) || email.includes(q) || subject.includes(q) || body.includes(q);
    });
  }, [messages, query]);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Messages</h2>
          <p className="text-gray-500 max-w-md">
            All messages submitted by users. Use the search to quickly find a message.
          </p>
        </div>

        <div className="w-full sm:w-1/3">
          <label className="relative block">
            <span className="sr-only">Search messages</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or content..."
              className="placeholder-gray-400 bg-white border border-gray-200 shadow-sm rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </label>
        </div>
      </div>

      <div>
        {loading && <p className="text-gray-600">Loading messages...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && (!messages || messages.length === 0) && (
          <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-gray-600">No messages yet.</div>
        )}

        {!loading && filtered && filtered.length === 0 && messages && messages.length > 0 && (
          <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-gray-600">No messages match your search.</div>
        )}

        <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
          {filtered && filtered.map((m) => {
            const id = m._id || m.id;
            const created = new Date(m.createdAt || m.date || Date.now()).toLocaleString();
            const isExpanded = expandedId === id;
            return (
              <article key={id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Avatar firstName={m.firstName} lastName={m.lastName} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="truncate">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{m.firstName} {m.lastName}</h3>
                        <p className="text-sm text-gray-500 truncate">{m.email} • {m.phoneNumber || '—'}</p>
                      </div>
                      <div className="text-sm text-gray-400 text-right">{created}</div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">{m.messageObject}</p>
                      <p className={`mt-2 text-sm text-gray-600 ${isExpanded ? 'whitespace-pre-wrap' : 'truncate'}`}>{m.message}</p>
                    </div>
                  </div>
                </div>


              </article>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Messages;
