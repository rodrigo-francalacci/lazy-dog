import React from 'react';

import styles from './SwiperItem.module.css';

export interface SwiperItemType {
    children: React.ReactNode,
  }

// exported so we can use later in tests
function SwiperItem({ children }: SwiperItemType) {
  return (
    <li className={styles.swiper_item}>
        {children}
    </li>
  );
}

export default SwiperItem;