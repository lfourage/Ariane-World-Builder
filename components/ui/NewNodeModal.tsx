"use client";
import { input } from "@lib/tv/input";
import { button } from "@lib/tv/button";

interface NewNodeModalProps {
  pos: {
    x: number;
    y: number;
  };
  closeModal: () => void;
}

export default function NewNodeModal({ pos, closeModal }: NewNodeModalProps) {
  return (
    <>
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => closeModal()}
      />
      <form
        className="absolute bg-white text-gray-900 p-5 rounded-xl shadow-2xl border border-gray-300"
        style={{
          top: pos.y,
          left: pos.x,
          transform: "translate(-50%, -20%)",
        }}
      >
        <label htmlFor="eventTitle">Title</label>
        <input type="text" id="eventTitle" className={input()} />
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
