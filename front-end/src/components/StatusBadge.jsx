const STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
};

const LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};


const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STYLES[status] || STYLES.cancelled}`}>
    {LABELS[status] || status}
  </span>
);

export default StatusBadge;
