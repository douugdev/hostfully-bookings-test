"use client";

import { areIntervalsOverlapping } from "date-fns";
import { PropsWithChildren, createContext, useCallback, useContext, useState } from "react";
import { BOOKING_ALREADY_TAKEN } from "./errors";

export type Booking = {
  title: string | undefined;
  start: Date | undefined;
  end: Date | undefined;
};

type BookingContextData = {
  bookings: Booking[];
  createNewBooking: () => void;
  deleteBooking: (index: number) => void;
  editBooking: (index: number, newBooking: Partial<Booking>) => void;
};

export const BookingContext = createContext<BookingContextData>({} as BookingContextData); // Will be initialized inside the provider

export const BookingProvider = ({ children }: PropsWithChildren) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const createNewBooking: BookingContextData["createNewBooking"] = useCallback(() => {
    return setBookings((prev) => [...prev, { title: undefined, start: undefined, end: undefined }]);
  }, []);

  const editBooking: BookingContextData["editBooking"] = useCallback(
    (index, newBooking) => {
      const isWithinRange = bookings.some((booking, prevIndex) => {
        if (!booking.start || !booking.end || !newBooking.start || !newBooking.end) return false;

        if (index === prevIndex) return false;

        return areIntervalsOverlapping(
          {
            start: booking.start,
            end: booking.end,
          },
          {
            start: newBooking.start,
            end: newBooking.end,
          }
        );
      });

      if (isWithinRange) {
        throw new Error(BOOKING_ALREADY_TAKEN);
      }

      return setBookings((prev) =>
        prev.map((prevBooking, prevBookingIndex) => {
          if (index !== prevBookingIndex) {
            return prevBooking;
          }
          return {
            title: newBooking.title ?? prevBooking.title,
            start: newBooking.start ?? prevBooking.start,
            end: newBooking.end ?? prevBooking.end,
          };
        })
      );
    },
    [bookings]
  );

  const deleteBooking: BookingContextData["deleteBooking"] = useCallback((index) => {
    return setBookings((prev) => prev.filter((_, bookingIndex) => index !== bookingIndex));
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, createNewBooking, editBooking, deleteBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  return useContext(BookingContext);
};
