import { motion } from "framer-motion";

const ConnectionLine = ({ 
  connection, 
  sourcePosition, 
  targetPosition, 
  onDelete 
}) => {
  const sourceX = sourcePosition.x + 192; // node width
  const sourceY = sourcePosition.y + 50;  // approximate port position
  const targetX = targetPosition.x;
  const targetY = targetPosition.y + 50;

  // Create bezier curve path
  const midX = (sourceX + targetX) / 2;
  const path = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;

  return (
    <g>
      <motion.path
        d={path}
        className="connection-line"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
        onClick={onDelete}
        style={{ cursor: "pointer" }}
      />
      
      {/* Animated flow particle */}
      <motion.circle
        r="3"
        fill="#2563eb"
        opacity="0.8"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          offsetPath: `path('${path}')`,
          offsetRotate: "0deg"
        }}
      />
    </g>
  );
};

export default ConnectionLine;