"use client";
import { FormEvent, useState, useEffect } from "react";
import { modal, formField, textarea, button, icon } from "@styles";
import type { EventNodeData } from "@types";

interface EventFormModalProps {
  eventId?: string | null;
  initialData?: EventNodeData;
  handleSubmit: (title: string, description?: string) => void;
  closeModal: () => void;
}

export function EventFormModal({
  eventId,
  initialData,
  handleSubmit,
  closeModal,
}: EventFormModalProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const modalStyles = modal({ size: "sm" });
  const fieldStyles = formField({ size: "sm" });
  const iconStyles = icon({ size: "sm" });

  useEffect(() => {
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
  }, [initialData]);

  const onSubmit = (e: FormEvent | null = null) => {
    e?.preventDefault();
    if (title.trim()) {
      handleSubmit(title, description);
      closeModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      onSubmit();
    } else if (e.key === "Escape") {
      closeModal();
    }
  };

  const isEditMode = !!eventId;

  return (
    <>
      <div className={modalStyles.overlay()} onClick={closeModal} />

      <form
        onSubmit={onSubmit}
        className={modalStyles.container()}
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className={modalStyles.header()}>
          <h2 className={modalStyles.title()}>{isEditMode ? "Edit event" : "New event"}</h2>
          <button type="button" onClick={closeModal} className={modalStyles.closeButton()}>
            <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={modalStyles.content()}>
          <div className={fieldStyles.wrapper()}>
            <label htmlFor="eventTitle" className={fieldStyles.label()}>
              Title
            </label>
            <input
              type="text"
              id="eventTitle"
              className={fieldStyles.input()}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give a title to your event..."
              maxLength={20}
              autoFocus
            />
          </div>

          <div className={fieldStyles.wrapper()}>
            <label htmlFor="eventDescription" className={fieldStyles.label()}>
              Description
            </label>
            <textarea
              id="eventDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={textarea({ size: "sm" })}
              placeholder="Describe the event..."
            />
          </div>
        </div>

        <div className={modalStyles.footer()}>
          <button
            className={button({
              intent: "nature",
              size: "md",
              fullWidth: true,
            })}
            type="submit"
            disabled={!title.trim()}
          >
            {isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </>
  );
}
