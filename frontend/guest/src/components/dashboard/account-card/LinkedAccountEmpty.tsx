import styles from './LinkedAccountEmpty.module.css'

export function LinkedAccountEmpty() {
  return (
    <div className={styles.accountLinkedEmpty}>
      <img
        alt=""
        aria-hidden="true"
        height="100"
        loading="lazy"
        src="/assets/system-error.svg"
        width="100"
      />
      <p>
        We can't display your linked accounts right now.
        <br />
        Please refresh or try again later.
      </p>
    </div>
  )
}
