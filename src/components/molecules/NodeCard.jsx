import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NodeCard = ({ 
  node, 
  onClick, 
  className,
  draggable = false,
  onDragStart
}) => {
  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, node);
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-node-hover transition-all duration-200",
        "flex items-center gap-3",
        className
      )}
      onClick={onClick}
      draggable={draggable}
      onDragStart={handleDragStart}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm"
        style={{ backgroundColor: node.color }}
      >
        <ApperIcon name={node.icon} className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 text-sm leading-tight truncate">
          {node.name}
        </h4>
        <p className="text-xs text-gray-500 leading-tight mt-0.5 line-clamp-2">
          {node.description}
        </p>
      </div>
    </motion.div>
  );
};

export default NodeCard;