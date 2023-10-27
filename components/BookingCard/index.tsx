"use client";

import { addHours, format, isAfter, isBefore, isEqual, isValid, parse } from "date-fns";
import React, { useCallback, useMemo, useState } from "react";
import styles from "./styles.module.scss";

type BookingCardProps = {
  title?: string;
  start?: Date;
  end?: Date;
  onEdit?: (newTitle: string, newStart: Date, newEnd: Date) => boolean;
  onDelete?: () => void;
};

const BookingCard = ({ title, start, end, onEdit, onDelete }: BookingCardProps) => {
  const isNewBooking = useMemo(() => {
    return !title && !start && !end;
  }, [end, start, title]);

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(isNewBooking);

  const [editingTitle, setEditingTitle] = useState<string>(title ?? "");
  const [editingStart, setEditingStart] = useState<Date | undefined>(start);
  const [editingEnd, setEditingEnd] = useState<Date | undefined>(end);

  const stringifiedStartDate = useMemo(() => {
    return start ? format(start, "MM/dd/yyyy '@' HH:mm") : undefined;
  }, [start]);

  const stringifiedEndDate = useMemo(() => {
    return end ? format(end, "MM/dd/yyyy '@' HH:mm") : undefined;
  }, [end]);

  const areInputsValid = useCallback(() => {
    if (!(editingTitle && editingStart && editingEnd)) {
      return false;
    }

    if (isAfter(editingStart, editingEnd)) {
      return false;
    }

    if (isEqual(editingEnd, editingStart)) {
      return false;
    }

    return true;
  }, [editingEnd, editingStart, editingTitle]);

  const selectStart = useCallback(
    (startDate: string | undefined) => {
      if (!startDate) return;

      const parsedDate = parse(startDate, "yyyy-MM-dd'T'HH:mm", new Date());

      if (!isValid(parsedDate)) return;

      // Start date cannot be after the end
      if (editingEnd && (isAfter(parsedDate, editingEnd) || isEqual(parsedDate, editingEnd))) {
        return setEditingStart(addHours(editingEnd, -1));
      }

      return setEditingStart(parsedDate);
    },
    [editingEnd]
  );

  const selectEnd = useCallback(
    (endDate: string | undefined) => {
      if (!endDate) return;

      const parsedDate = parse(endDate, "yyyy-MM-dd'T'HH:mm", new Date());

      if (!isValid(parsedDate)) return;

      // End date cannot be before the start
      if (editingStart && (isBefore(parsedDate, editingStart) || isEqual(parsedDate, editingStart))) {
        return setEditingEnd(addHours(editingStart, 1));
      }

      return setEditingEnd(parsedDate);
    },
    [editingStart]
  );

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={styles.cardContainer}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {!isEditing ? (
        <>
          {isHovering && (
            <div className={styles.cardButton}>
              <h2 className={styles.cardButtonText}>Edit</h2>
            </div>
          )}
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.datesContainer}>
            <span>
              <b>Start:</b> &nbsp;{stringifiedStartDate}
            </span>
            <span>
              <b>End:</b> &nbsp;{stringifiedEndDate}
            </span>
          </div>
        </>
      ) : (
        <>
          <input placeholder="Title" onChange={(e) => setEditingTitle(e.target.value)} value={editingTitle} />
          <div>
            <div>
              <label>Start:&nbsp;</label>
              <input
                type="datetime-local"
                onChange={(e) => selectStart(e.target.value)}
                value={isValid(editingStart) ? format(editingStart!, "yyyy-MM-dd'T'HH:mm") : undefined}
              />
            </div>
            <div>
              <label>End:&nbsp;</label>
              <input
                type="datetime-local"
                onChange={(e) => selectEnd(e.target.value)}
                value={isValid(editingEnd) ? format(editingEnd!, "yyyy-MM-dd'T'HH:mm") : undefined}
              />
            </div>
          </div>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                try {
                  onDelete?.();
                } finally {
                }
              }}
            >
              Delete
            </button>
            <button
              disabled={!areInputsValid()}
              onClick={() => {
                if (!editingStart || !editingEnd || !onEdit) {
                  return;
                }

                onEdit(editingTitle, editingStart, editingEnd) && setIsEditing(false);
              }}
            >
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingCard;
