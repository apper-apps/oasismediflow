import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkflowList from "@/components/organisms/WorkflowList";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateWorkflow = () => {
    navigate("/workflow/new");
  };

  const handleEditWorkflow = (workflow) => {
    navigate(`/workflow/${workflow.Id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkflowList 
        onCreate={handleCreateWorkflow}
        onEdit={handleEditWorkflow}
      />
    </div>
  );
};

export default Dashboard;