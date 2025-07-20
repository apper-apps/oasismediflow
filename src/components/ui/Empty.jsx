import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  type = "workflow", 
  onAction, 
  actionLabel = "Get Started" 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "workflow":
        return {
          icon: "Workflow",
          title: "No Workflows Yet",
          description: "Create your first medical workflow to automate patient care processes and improve efficiency.",
          gradient: "from-primary-500 to-secondary-500"
        };
      case "canvas":
        return {
          icon: "Plus",
          title: "Empty Canvas",
          description: "Drag nodes from the sidebar to start building your medical automation workflow.",
          gradient: "from-success-500 to-primary-500"
        };
      case "execution":
        return {
          icon: "Play",
          title: "No Executions",
          description: "Run your workflow to see execution logs and results here.",
          gradient: "from-warning-500 to-error-500"
        };
      default:
        return {
          icon: "FileX",
          title: "No Data",
          description: "Nothing to display at the moment.",
          gradient: "from-gray-400 to-gray-500"
        };
    }
  };

  const { icon, title, description, gradient } = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center h-full"
    >
      <div className={`w-24 h-24 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mb-6 shadow-medical`}>
        <ApperIcon name={icon} className="w-12 h-12 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{description}</p>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          className={`px-8 py-3 bg-gradient-to-r ${gradient} text-white rounded-lg font-semibold hover:shadow-elevated transition-all duration-300 flex items-center gap-3`}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;