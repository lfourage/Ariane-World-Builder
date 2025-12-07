"use client";
import { useState } from "react";
import { Position, Handle } from "@xyflow/react";
import { flowNode } from "@lib/tv/node";
import { icon } from "@lib/tv/icon";

type EventNodeProps = {
  data: {
    title: string;
    description?: string;
    variant?: "default" | "primary" | "success" | "warning" | "danger";
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
  };
  id: string;
};

function EventNode({ data, id }: EventNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const nodeStyles = flowNode({ variant: data.variant || "default", size: "md" });
  const iconStyles = icon({ size: "sm" });

  return (
    <div
      className={nodeStyles.container()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-green-500"
      />

      <div
        className={`${nodeStyles.actions()} ${isHovered ? "opacity-100" : "opacity-0"}`}
      >
        {data.onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onEdit?.(id);
            }}
            className={`${nodeStyles.actionButton()} hover:bg-green-500/20`}
            title="Edit"
          >
            <svg
              className={`${iconStyles} text-green-600`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}

        {data.onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            className={`${nodeStyles.actionButton()} hover:bg-red-500/20`}
            title="Delete"
          >
            <svg
              className={`${iconStyles} text-red-500`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className={nodeStyles.header()}>{data.title}</div>
        {data.description && (
          <div className={nodeStyles.description()}>{data.description}</div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-green-500"
      />
    </div>
  );
}

export default EventNode;
