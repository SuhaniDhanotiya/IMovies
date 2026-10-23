export function MovieGridSkeleton({ count = 10 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading movies">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skel-card">
          <div className="skeleton" />
          <div className="skeleton skel-line" />
          <div className="skeleton skel-line short" />
        </div>
      ))}
    </div>
  )
}
