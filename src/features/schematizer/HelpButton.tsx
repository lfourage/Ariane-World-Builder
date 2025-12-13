"use client";
import { useState } from "react";
import { button } from "@styles";

const tips = [
  {
    icon: "🖱️",
    title: "Create Event",
    desc: "Double-click on canvas to create a new event",
  },
  {
    icon: "✏️",
    title: "Edit Event",
    desc: "Double-click on an event to edit its details",
  },
  {
    icon: "🔗",
    title: "Connect Events",
    desc: "Drag from the bottom ○ of one event to another to connect them",
  },
  {
    icon: "⌫",
    title: "Delete",
    desc: "Click items to select them, then use Delete button or Delete key",
  },
  {
    icon: "🖱️",
    title: "Context Menu",
    desc: "Right-click (or long-press on mobile) for more options",
  },
  {
    icon: "🗺️",
    title: "Minimap Navigation",
    desc: "Drag the minimap viewport (bottom-left) to quickly navigate the canvas",
  },
  {
    icon: "💾",
    title: "Save",
    desc: "Don't forget to save your changes with the Save button!",
  },
];

export function HelpButton() {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* Help Button - Top Left */}
      <button
        onClick={() => setShow(!show)}
        className={button({ intent: "ghost", size: "sm" }) + " absolute top-20 left-4 z-10"}
        title="Show help"
      >
        ❓ Help
      </button>

      {/* Tutorial Overlay */}
      {show && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShow(false)}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">How to use Schematizer</h2>
              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-2xl shrink-0">{tip.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{tip.title}</h3>
                    <p className="text-gray-400 text-sm">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShow(false)}
              className={button({ intent: "nature", fullWidth: true }) + " mt-6"}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
