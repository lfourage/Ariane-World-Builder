"use client";
import { input } from "@lib/tv/input";
import { button } from "@lib/tv/button";
import { FormEvent, useState } from "react";

interface NewNodeModalProps {
  pos: {
    x: number;
    y: number;
  };
  addNode: (label: string) => void;
  closeModal: () => void;
}

export default function NewNodeModal({
  pos,
  addNode,
  closeModal,
}: NewNodeModalProps) {
  const [label, setLabel] = useState("");

  const handleSubmit = (e: FormEvent | null = null) => {
    e?.preventDefault();
    if (label.trim()) {
      addNode(label);
      closeModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      closeModal();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center"
        onClick={closeModal}
      />
      <form
        onSubmit={handleSubmit}
        className="absolute bg-white text-gray-900 p-5 rounded-xl shadow-2xl border border-gray-300"
        style={{
          position: "absolute",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor="eventTitle">Title</label>
        <input
          type="text"
          id="eventTitle"
          className={input()}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          className={button({ intent: "nature", size: "md" })}
          type="submit"
        >
          Submit
        </button>
      </form>
    </>
  );
}
