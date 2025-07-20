import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const WorkflowCard = ({ workflow, onEdit, onDelete, onExecute }) => {
  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    active: "bg-success-100 text-success-700",
    paused: "bg-warning-100 text-warning-700"
  };

  const statusIcons = {
    draft: "FileText",
    active: "CheckCircle",
    paused: "PauseCircle"
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-elevated transition-all duration-300"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {workflow.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {workflow.description}
          </p>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[workflow.status]}`}>
          <div className="flex items-center gap-1">
            <ApperIcon name={statusIcons[workflow.status]} className="w-3 h-3" />
            {workflow.status}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <ApperIcon name="Layers" className="w-4 h-4" />
          {workflow.nodes?.length || 0} nodes
        </div>
        <div className="flex items-center gap-1">
          <ApperIcon name="Clock" className="w-4 h-4" />
          {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          icon="Edit"
          onClick={() => onEdit(workflow)}
        >
          Edit
        </Button>
        
        {workflow.status === "active" && (
          <Button
            variant="success"
            size="sm"
            icon="Play"
            onClick={() => onExecute(workflow)}
          >
            Run
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={() => onDelete(workflow)}
          className="text-error-500 hover:text-error-600 hover:bg-error-50"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default WorkflowCard;