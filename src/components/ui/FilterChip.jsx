export default function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border
        ${active
          ? "bg-cafe-900 text-white border-cafe-900"
          : "bg-white text-cafe-700 border-cafe-200 hover:border-cafe-400"
        }`}
    >
      {label}
    </button>
  );
}
