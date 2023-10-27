"use client";

import BookingCard from "@/components/BookingCard";
import styles from "./page.module.scss";
import { useBooking } from "@/contexts/bookings";
import AddBookingCard from "@/components/AddBookingCard";
import { isBookingAlreadyExistsError } from "@/contexts/errors";
import { useEffect, useState } from "react";

export default function Home() {
  const { bookings, editBooking, createNewBooking, deleteBooking } = useBooking();
  const [currentError, setCurrentError] = useState<string>();

  useEffect(() => {
    if (currentError) {
      setTimeout(() => {
        setCurrentError(undefined);
      }, 2500);
    }
  }, [currentError]);

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Bookings &nbsp;&nbsp; ━━━━━━━</h1>
      {currentError && <li className={styles.error}>{currentError}</li>}
      <div className={styles.cardList}>
        {bookings.map((booking, index) => {
          return (
            <BookingCard
              key={"title" + index}
              title={booking.title}
              start={booking.start}
              end={booking.end}
              onEdit={(title, start, end) => {
                try {
                  editBooking(index, { title, start, end });
                  return true;
                } catch (e) {
                  if (isBookingAlreadyExistsError(e)) {
                    setCurrentError("This booking date was already taken.");
                  }
                  return false;
                }
              }}
              onDelete={() => deleteBooking(index)}
            />
          );
        })}
        <AddBookingCard onAdd={() => createNewBooking()} />
      </div>
    </main>
  );
}
