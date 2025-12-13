import { ReactFlow, Background, MiniMap, Controls } from "@xyflow/react";
import type {
  Node,
  Edge,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeMouseHandler,
  EdgeMouseHandler,
} from "@xyflow/react";
import { useMediaQuery } from "@hooks";
import { EventNode } from ".";

const nodeTypes: NodeTypes = {
  eventNode: EventNode,
};

interface FlowCanvasProps<T extends Node = Node> {
  nodes: T[];
  edges: Edge[];
  onNodesChange: OnNodesChange<T>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  onNodeClick?: NodeMouseHandler<T>;
  onNodeDoubleClick?: NodeMouseHandler<T>;
  onEdgeClick?: EdgeMouseHandler;
  onNodeContextMenu?: NodeMouseHandler<T>;
  onEdgeContextMenu?: EdgeMouseHandler;
  onPaneClick?: (event: React.MouseEvent | MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent | MouseEvent) => void;
  onPaneContextMenu?: (event: React.MouseEvent | MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  showMiniMap?: boolean;
  showControls?: boolean;
}

export function FlowCanvas<T extends Node = Node>({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onNodeDoubleClick,
  onEdgeClick,
  onNodeContextMenu,
  onEdgeContextMenu,
  onPaneClick,
  onDoubleClick,
  onPaneContextMenu,
  onKeyDown,
  showMiniMap = true,
  showControls = true,
}: FlowCanvasProps<T>) {
  const isPortrait = useMediaQuery("(orientation: portrait)");

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onNodeDoubleClick={onNodeDoubleClick}
      onEdgeClick={onEdgeClick}
      onNodeContextMenu={onNodeContextMenu}
      onEdgeContextMenu={onEdgeContextMenu}
      onPaneClick={onPaneClick}
      onDoubleClick={onDoubleClick}
      onPaneContextMenu={onPaneContextMenu}
      onKeyDown={onKeyDown}
      zoomOnDoubleClick={false}
      style={{ backgroundColor: "#1a1a1a" }}
      fitView
    >
      <Background color="#333" gap={20} />

      {showMiniMap && (
        <MiniMap
          position="bottom-left"
          pannable={true}
          nodeColor={() => "#4ade80"}
          maskColor="rgba(0,0,0,0.6)"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #374151",
            borderRadius: "8px",
            width: isPortrait ? 100 : 150,
            height: isPortrait ? 75 : 100,
          }}
        />
      )}

      {showControls && (
        <Controls
          position="bottom-right"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
      )}
    </ReactFlow>
  );
}
