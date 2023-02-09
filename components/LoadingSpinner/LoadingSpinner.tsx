/* React */
import React from "react";

/* Styles */
import styles from "./LoadingSpinner.module.scss";

/* Type */
type Props ={
    size: `${number}%`;
}

const LoadingSpinner = ({size}:Props) => {
  return (
    
    <div style={{ width: size, height: size, margin: "0 auto", padding: "0.3rem"}}>
        <div className={styles.loader}>
          <div />
          <div />
        </div>
    </div>
  );
};

export default LoadingSpinner;
