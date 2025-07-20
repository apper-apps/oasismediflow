import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { nodeService } from "@/services/api/nodeService";
import { useState, useEffect } from "react";

const CanvasNode = ({ 
  node, 
  selected, 
  connecting,
  onMouseDown, 
  onPortClick, 
  onDelete, 
  onConfigClick 
}) => {
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const nodeTemplate = await nodeService.getNodeTemplate(node.type);
        setTemplate(nodeTemplate);
      } catch (err) {
        console.error("Failed to load node template:", err);
      }
    };
    
    loadTemplate();
  }, [node.type]);

  if (!template) {
    return (
      <div
        className="absolute w-48 h-16 bg-gray-200 rounded-lg animate-pulse"
        style={{
          left: node.position.x,
          top: node.position.y
        }}
      />
    );
  }

  const statusColors = {
    idle: "border-gray-300",
    running: "border-warning-400 shadow-warning-300",
    success: "border-success-400 shadow-success-300",
    error: "border-error-400 shadow-error-300"
  };

  const statusIcons = {
    idle: "Circle",
    running: "Loader2",
    success: "CheckCircle",
    error: "XCircle"
  };

  return (
    <motion.div
      className={`absolute w-48 bg-white rounded-lg border-2 shadow-node hover:shadow-node-hover transition-all duration-200 ${statusColors[node.status]} ${selected ? "ring-2 ring-primary-400" : ""}`}
      style={{
        left: node.position.x,
        top: node.position.y
      }}
      onMouseDown={onMouseDown}
      whileHover={{ scale: 1.02 }}
      drag={false}
    >
      {/* Node header */}
      <div 
        className="flex items-center gap-3 p-3 rounded-t-lg text-white"
        style={{ backgroundColor: template.color }}
      >
        <ApperIcon name={template.icon} className="w-5 h-5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{template.name}</h4>
        </div>
        <div className="flex items-center gap-1">
          <ApperIcon 
            name={statusIcons[node.status]} 
            className={`w-4 h-4 ${node.status === "running" ? "animate-spin" : ""}`} 
          />
          <button
            onClick={onConfigClick}
            className="p-1 hover:bg-white/20 rounded"
          >
            <ApperIcon name="Settings" className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-white/20 rounded"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Node body */}
      <div className="p-3">
        <p className="text-xs text-gray-600 line-clamp-2">
          {template.description}
        </p>
      </div>

      {/* Input ports */}
      {template.inputs?.map((input, index) => (
        <button
          key={input}
          className={`node-port -left-1.5 ${connecting?.type === "output" ? "hover:bg-primary-500" : ""}`}
          style={{ top: `${40 + index * 20}px` }}
          onClick={() => onPortClick(node.id, input, "input")}
        />
      ))}

      {/* Output ports */}
      {template.outputs?.map((output, index) => (
        <button
          key={output}
          className={`node-port -right-1.5 ${!connecting || connecting.type === "input" ? "hover:bg-primary-500" : ""}`}
          style={{ top: `${40 + index * 20}px` }}
          onClick={() => onPortClick(node.id, output, "output")}
        />
      ))}
    </motion.div>
  );
};

export default CanvasNode;