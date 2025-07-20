import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NodeCard from "@/components/molecules/NodeCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { nodeService } from "@/services/api/nodeService";

const NodePalette = ({ onDragStart }) => {
  const [nodeTemplates, setNodeTemplates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("clinical");

  const categories = [
    { id: "clinical", name: "Clinical", icon: "Stethoscope", color: "text-primary-600" },
    { id: "administrative", name: "Administrative", icon: "Clipboard", color: "text-warning-600" },
    { id: "communication", name: "Communication", icon: "MessageCircle", color: "text-secondary-600" },
    { id: "data", name: "Data", icon: "Database", color: "text-success-600" }
  ];

  useEffect(() => {
    loadNodeTemplates();
  }, []);

  const loadNodeTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const templates = await nodeService.getNodeTemplates();
      setNodeTemplates(templates);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, node) => {
    if (onDragStart) {
      onDragStart(e, node);
    }
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Node Palette</h2>
          <div className="flex space-x-1 mb-4">
            {categories.map((category) => (
              <div key={category.id} className="h-8 bg-gray-200 rounded flex-1" />
            ))}
          </div>
        </div>
        <Loading type="nodes" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <Error message={error} onRetry={loadNodeTemplates} />
      </div>
    );
  }

  const activeNodes = nodeTemplates[activeCategory] || [];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Node Palette</h2>
        
        <div className="grid grid-cols-2 gap-1">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeCategory === category.id
                  ? "bg-primary-100 text-primary-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon 
                name={category.icon} 
                className={`w-4 h-4 ${activeCategory === category.id ? "text-primary-600" : "text-gray-500"}`} 
              />
              <span className="truncate">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {activeNodes.map((node) => (
              <NodeCard
                key={node.Id}
                node={node}
                draggable
                onDragStart={handleDragStart}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NodePalette;