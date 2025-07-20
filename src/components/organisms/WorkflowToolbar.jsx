import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const WorkflowToolbar = ({ 
  workflow,
  onSave, 
  onTest, 
  onDeploy, 
  onExecute,
  saving = false,
  testing = false,
  executing = false
}) => {
  const getStatusColor = () => {
    if (!workflow) return "text-gray-500";
    
    switch (workflow.status) {
      case "active": return "text-success-500";
      case "paused": return "text-warning-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = () => {
    if (!workflow) return "FileText";
    
    switch (workflow.status) {
      case "active": return "CheckCircle";
      case "paused": return "PauseCircle";
      default: return "FileText";
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <ApperIcon name="Workflow" className="w-6 h-6 text-primary-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {workflow?.name || "Untitled Workflow"}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <ApperIcon name={getStatusIcon()} className={`w-4 h-4 ${getStatusColor()}`} />
              <span className={getStatusColor()}>
                {workflow?.status || "draft"}
              </span>
              {workflow && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">
                    {workflow.nodes?.length || 0} nodes
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          icon="Save"
          onClick={onSave}
          loading={saving}
        >
          Save
        </Button>

        <Button
          variant="outline"
          icon="TestTube"
          onClick={onTest}
          loading={testing}
        >
          Test
        </Button>

        {workflow?.status === "draft" ? (
          <Button
            variant="success"
            icon="Rocket"
            onClick={onDeploy}
          >
            Deploy
          </Button>
        ) : (
          <Button
            variant="primary"
            icon="Play"
            onClick={onExecute}
            loading={executing}
          >
            Execute
          </Button>
        )}

        <div className="w-px h-6 bg-gray-200" />

        <Button
          variant="ghost"
          icon="MoreHorizontal"
        />
      </div>
    </div>
  );
};

export default WorkflowToolbar;