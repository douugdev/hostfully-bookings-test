import React from "react";
import styles from "./styles.module.scss";

type AddBookingCardProps = {
  onAdd: () => void;
};

const AddBookingCard = ({ onAdd }: AddBookingCardProps) => {
  return (
    <div className={styles.cardContainer} onClick={onAdd}>
      <div className={styles.cardButton}>
        <h2 className={styles.cardButtonText}>Add</h2>
      </div>
    </div>
  );
};

export default AddBookingCard;
