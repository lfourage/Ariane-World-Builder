import { Node } from "@xyflow/react";

export type EventNodeData = {
  title: string;
  description?: string;
  selected?: boolean;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  onEdit?: (node: EventFlowNode) => void;
  onDelete?: (id: string) => void;
};

export type EventFlowNode = Node<EventNodeData, "eventNode">;
