"use client";

import { useState } from "react";
import { Position, Handle, NodeProps } from "@xyflow/react";


export interface EventNodeData {
  id: string;
  title: string;
  description?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function EventNode({ data }: NodeProps<EventNodeData>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[200px] max-w-[300px] relative bg-gray-200 border-green-500}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-green-500"
      />

      {/* Action buttons container */}
      <div
        className={`absolute top-2 right-2 flex gap-1 transition-opacity z-10 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        {data.onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onEdit?.(data.id);
            }}
            className="p-1 rounded hover:bg-green-500/20 bg-gray-300 shadow-sm"
            title="Edit"
          >
            <svg
              className="w-4 h-4 text-green-600"
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
              data.onDelete?.(data.id);
            }}
            className="p-1 rounded hover:bg-red-500/20 bg-gray-300 shadow-sm"
            title="Delete"
          >
            <svg
              className="w-4 h-4 text-red-500"
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
        <div className="font-bold text-gray-900">{data.title}</div>

        {data.description && (
          <div className="text-sm text-gray-600 line-clamp-2">
            {data.description}
          </div>
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

export default EventNode
