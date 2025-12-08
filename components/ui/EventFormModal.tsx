"use client";
import { FormEvent, useState, useEffect, useRef } from "react";
import { modal } from "@lib/tv/modal";
import { formField, textarea } from "@lib/tv/form";
import { button } from "@lib/tv/button";
import { icon } from "@lib/tv/icon";
import { EventNodeData } from "./EventNode";

interface EventFormModalProps {
  eventId?: string | null;
  initialData?: EventNodeData
  pos: {
    x: number;
    y: number;
  };
  addNode: (title: string, description?: string) => void;
  updateNode?: (id: string, title: string, description?: string) => void;
  closeModal: () => void;
}

export default function EventFormModal({
  eventId,
  initialData,
  pos,
  addNode,
  updateNode,
  closeModal,
}: EventFormModalProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [adjustedPos, setAdjustedPos] = useState(pos);
  const formRef = useRef<HTMLFormElement>(null);

  const modalStyles = modal({ size: "sm" });
  const fieldStyles = formField({ size: "sm" });
  const iconStyles = icon({ size: "sm" });

  useEffect(() => {
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
  }, [initialData]);

  useEffect(() => {
    const adjustPosition = () => {
      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        const isMobile = window.innerWidth < 640 || window.innerHeight < 500 || 
                        ('ontouchstart' in window);
        
        if (isMobile) {
          setAdjustedPos({
            x: window.innerWidth / 2,
            y: Math.min(window.innerHeight / 2, rect.height / 2 + 20),
          });
          return;
        }

        const padding = 20;
        let newX = pos.x;
        let newY = pos.y;

        const modalHalfWidth = rect.width / 2;
        const modalHalfHeight = rect.height / 2;

        const leftEdge = newX - modalHalfWidth;
        const rightEdge = newX + modalHalfWidth;
        
        if (leftEdge < padding) {
          newX = modalHalfWidth + padding;
        } else if (rightEdge > window.innerWidth - padding) {
          newX = window.innerWidth - modalHalfWidth - padding;
        }

        const topEdge = newY - modalHalfHeight;
        const bottomEdge = newY + modalHalfHeight;
        
        if (topEdge < padding) {
          newY = modalHalfHeight + padding;
        } else if (bottomEdge > window.innerHeight - padding) {
          newY = window.innerHeight - modalHalfHeight - padding;
        }

        setAdjustedPos({ x: newX, y: newY });
      }
    };

    adjustPosition();
    const timer = setTimeout(adjustPosition, 10);
    
    return () => clearTimeout(timer);
  }, [pos]);

  const handleSubmit = (e: FormEvent | null = null) => {
    e?.preventDefault();
    if (title.trim()) {
      if (eventId && updateNode) {
        updateNode(eventId, title, description);
      } 
      else {
        addNode(title, description);
      }
      closeModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    } else if (e.key === "Escape") {
      closeModal();
    }
  };

  const isEditMode = !!eventId;

  return (
    <>
      <div
        className={modalStyles.overlay()}
        onClick={closeModal}
      />
      
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={modalStyles.container()}
        style={{
          position: "absolute",
          left: `${adjustedPos.x}px`,
          top: `${adjustedPos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className={modalStyles.header()}>
          <h2 className={modalStyles.title()}>
            {isEditMode ? "Edit event" : "New event"}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className={modalStyles.closeButton()}
          >
            <svg className={iconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
            className={button({ intent: "nature", size: "md", fullWidth: true })}
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
