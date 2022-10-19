import React from 'react'
import styles from './Logo.module.scss'

const Logo = () => {
  return (
    <div className={`gooddog-logo prevent-select ${styles.container}`}>
        <h1 className={styles.lazy_dog}>Lazy Dog</h1>
        <p className={styles.company}>company</p>
    </div>
  )
}

export default Logo