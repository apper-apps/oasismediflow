import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkflowList from "@/components/organisms/WorkflowList";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateWorkflow = () => {
    navigate("/workflow/new");
  };

  const handleBrowseTemplates = () => {
    navigate("/templates");
  };

  const handleEditWorkflow = (workflow) => {
    navigate(`/workflow/${workflow.Id}`);
  };

return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Workflows</h1>
            <p className="text-gray-600 mt-2">Build and manage automated medical processes</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleBrowseTemplates}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Layout" size={16} />
              Browse Templates
            </Button>
            <Button
              onClick={handleCreateWorkflow}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={16} />
              Create Workflow
            </Button>
          </div>
        </div>
        
        <WorkflowList 
          onCreate={handleCreateWorkflow}
          onEdit={handleEditWorkflow}
        />
      </div>
    </div>
  );
};

export default Dashboard;