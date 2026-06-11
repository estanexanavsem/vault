export function UpcomingActivityEmpty() {
  return (
    <div className="activity-empty">
      <p>You have no upcoming transactions.</p>
      <img
        alt=""
        aria-hidden="true"
        height="200"
        loading="lazy"
        src="/assets/no-recent-transactions.svg"
        width="200"
      />
    </div>
  )
}
