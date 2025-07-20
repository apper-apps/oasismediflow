import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WorkflowCard from "@/components/molecules/WorkflowCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { workflowService } from "@/services/api/workflowService";
import { toast } from "react-toastify";

const WorkflowList = ({ onEdit, onCreate }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workflow) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    
    try {
      await workflowService.delete(workflow.Id);
      setWorkflows(prev => prev.filter(w => w.Id !== workflow.Id));
      toast.success("Workflow deleted successfully");
    } catch (err) {
      toast.error("Failed to delete workflow");
    }
  };

  const handleExecute = async (workflow) => {
    try {
      const result = await workflowService.executeWorkflow(workflow.Id);
      toast.success(`Workflow executed successfully (${result.executionId})`);
    } catch (err) {
      toast.error("Failed to execute workflow");
    }
  };

  if (loading) {
    return <Loading type="canvas" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadWorkflows} type="workflow" />;
  }

  if (workflows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty 
          type="workflow"
          onAction={onCreate}
          actionLabel="Create Your First Workflow"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Workflows</h1>
          <p className="text-gray-600">Manage your healthcare automation workflows</p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={onCreate}
        >
          New Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <motion.div
            key={workflow.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: workflow.Id * 0.1 }}
          >
            <WorkflowCard
              workflow={workflow}
              onEdit={onEdit}
              onDelete={handleDelete}
              onExecute={handleExecute}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowList;