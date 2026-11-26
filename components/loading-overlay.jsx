export default function LoadingOverlay({ message }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div
        role="status"
        className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-lg"
      >
        <span
          aria-hidden="true"
          className="size-5 shrink-0 rounded-full border-2 border-slate-200 border-t-emerald-700 motion-safe:animate-spin"
        />
        <span>{message}</span>
      </div>
    </div>
  );
}
