export const BOOKING_ALREADY_TAKEN = "BOOKING_ALREADY_TAKEN";

export const isBookingAlreadyExistsError = (e: unknown): boolean => {
  return e instanceof Error && e.message === BOOKING_ALREADY_TAKEN;
};
