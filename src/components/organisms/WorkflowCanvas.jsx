import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import CanvasNode from "@/components/molecules/CanvasNode";
import ConnectionLine from "@/components/molecules/ConnectionLine";

const WorkflowCanvas = ({ 
  workflow, 
  onNodeAdd, 
  onNodeUpdate, 
  onNodeDelete, 
  onConnectionAdd, 
  onConnectionDelete,
  selectedNode,
  onNodeSelect
}) => {
  const canvasRef = useRef(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState(null);

  const nodes = workflow?.nodes || [];
  const connections = workflow?.connections || [];

  // Handle node drag and drop from palette
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const nodeData = e.dataTransfer.getData("node");
    if (!nodeData) return;

    const node = JSON.parse(nodeData);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasOffset.x) / scale;
    const y = (e.clientY - rect.top - canvasOffset.y) / scale;

    const newNode = {
      id: `node-${Date.now()}`,
      type: node.type,
      position: { x, y },
      config: { ...node.config },
      status: "idle"
    };

    onNodeAdd(newNode);
  }, [canvasOffset, scale, onNodeAdd]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Handle canvas panning
  const handleMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }

    if (draggedNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasOffset.x - dragOffset.x) / scale;
      const y = (e.clientY - rect.top - canvasOffset.y - dragOffset.y) / scale;
      
      onNodeUpdate(draggedNode.id, { position: { x, y } });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNode(null);
    setConnecting(null);
  };

  // Handle zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, scale * delta));
    setScale(newScale);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [scale]);

  const handleNodeMouseDown = (node, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedNode(node);
    onNodeSelect(node);
  };

  const handlePortClick = (nodeId, portId, type) => {
    if (connecting) {
      if (connecting.nodeId !== nodeId && connecting.type !== type) {
        // Create connection
        const connection = {
          id: `conn-${Date.now()}`,
          sourceNodeId: type === "output" ? nodeId : connecting.nodeId,
          sourcePortId: type === "output" ? portId : connecting.portId,
          targetNodeId: type === "input" ? nodeId : connecting.nodeId,
          targetPortId: type === "input" ? portId : connecting.portId
        };
        onConnectionAdd(connection);
      }
      setConnecting(null);
    } else if (type === "output") {
      setConnecting({ nodeId, portId, type });
    }
  };

  if (!workflow || nodes.length === 0) {
    return (
      <div 
        ref={canvasRef}
        className="flex-1 bg-gray-50 canvas-grid relative overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Empty 
          type="canvas"
          onAction={() => {}}
          actionLabel="Drag nodes from the palette"
        />
      </div>
    );
  }

  return (
    <div
      ref={canvasRef}
      className="flex-1 bg-gray-50 canvas-grid relative overflow-hidden cursor-grab active:cursor-grabbing"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Canvas content */}
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale})`
        }}
      >
        {/* Render connections */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
          {connections.map((connection) => {
            const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
            const targetNode = nodes.find(n => n.id === connection.targetNodeId);
            
            if (!sourceNode || !targetNode) return null;
            
            return (
              <ConnectionLine
                key={connection.id}
                connection={connection}
                sourcePosition={sourceNode.position}
                targetPosition={targetNode.position}
                onDelete={() => onConnectionDelete(connection.id)}
              />
            );
          })}
        </svg>

        {/* Render nodes */}
        {nodes.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            selected={selectedNode?.id === node.id}
            connecting={connecting}
            onMouseDown={(e) => handleNodeMouseDown(node, e)}
            onPortClick={handlePortClick}
            onDelete={() => onNodeDelete(node.id)}
            onConfigClick={() => onNodeSelect(node)}
          />
        ))}
      </div>

      {/* Canvas controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <motion.button
          onClick={() => setScale(s => Math.min(3, s * 1.2))}
          className="w-10 h-10 bg-white rounded-lg shadow-medical border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4 text-gray-600" />
        </motion.button>
        
        <motion.button
          onClick={() => setScale(s => Math.max(0.1, s * 0.8))}
          className="w-10 h-10 bg-white rounded-lg shadow-medical border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Minus" className="w-4 h-4 text-gray-600" />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setScale(1);
            setCanvasOffset({ x: 0, y: 0 });
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-medical border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Home" className="w-4 h-4 text-gray-600" />
        </motion.button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-lg shadow-medical border border-gray-200 text-sm text-gray-600">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default WorkflowCanvas;