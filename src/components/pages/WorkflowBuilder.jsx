import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import NodePalette from "@/components/organisms/NodePalette";
import WorkflowCanvas from "@/components/organisms/WorkflowCanvas";
import ConfigurationPanel from "@/components/organisms/ConfigurationPanel";
import WorkflowToolbar from "@/components/organisms/WorkflowToolbar";
import ExecutionPanel from "@/components/organisms/ExecutionPanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { workflowService } from "@/services/api/workflowService";

const WorkflowBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [workflow, setWorkflow] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [showExecutionPanel, setShowExecutionPanel] = useState(false);

useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('template');
    
    if (id && id !== "new") {
      loadWorkflow();
    } else if (templateId) {
      loadFromTemplate(templateId);
    } else {
      // Create new workflow
      setWorkflow({
        name: "Untitled Workflow",
        description: "New medical workflow",
        nodes: [],
        connections: [],
        status: "draft"
      });
      setLoading(false);
    }
  }, [id]);

  const loadWorkflow = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await workflowService.getById(id);
      setWorkflow(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
};

  const loadFromTemplate = async (templateId) => {
    try {
      setLoading(true);
      setError("");
      const { templateService } = await import("@/services/api/templateService");
      const template = await templateService.getById(templateId);
      
      // Convert template to workflow format
      setWorkflow({
        name: `${template.name} (Copy)`,
        description: template.description,
        nodes: template.nodes.map(node => ({
          ...node,
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })),
        connections: template.connections.map(conn => ({
          ...conn,
          id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })),
        status: "draft"
      });
      
      toast.success(`Template "${template.name}" loaded successfully`);
    } catch (err) {
      setError("Failed to load template");
      toast.error("Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!workflow) return;
    
    try {
      setSaving(true);
      let savedWorkflow;
      
      if (workflow.Id) {
        savedWorkflow = await workflowService.update(workflow.Id, workflow);
      } else {
        savedWorkflow = await workflowService.create(workflow);
        navigate(`/workflow/${savedWorkflow.Id}`, { replace: true });
      }
      
      setWorkflow(savedWorkflow);
      toast.success("Workflow saved successfully");
    } catch (err) {
      toast.error("Failed to save workflow");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!workflow?.Id) {
      toast.warning("Please save the workflow first");
      return;
    }
    
    try {
      setTesting(true);
      const result = await workflowService.testWorkflow(workflow.Id);
      toast.success("Workflow test completed successfully");
    } catch (err) {
      toast.error("Workflow test failed");
    } finally {
      setTesting(false);
    }
  };

  const handleExecute = async () => {
    if (!workflow?.Id) {
      toast.warning("Please save the workflow first");
      return;
    }
    
    try {
      setExecuting(true);
      const result = await workflowService.executeWorkflow(workflow.Id);
      setShowExecutionPanel(true);
      toast.success("Workflow executed successfully");
    } catch (err) {
      toast.error("Workflow execution failed");
    } finally {
      setExecuting(false);
    }
  };

  const handleDeploy = async () => {
    if (!workflow?.Id) {
      toast.warning("Please save the workflow first");
      return;
    }
    
    try {
      const updatedWorkflow = await workflowService.update(workflow.Id, {
        ...workflow,
        status: "active"
      });
      setWorkflow(updatedWorkflow);
      toast.success("Workflow deployed successfully");
    } catch (err) {
      toast.error("Failed to deploy workflow");
    }
  };

  const handleNodeAdd = (node) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: [...(prev.nodes || []), node]
    }));
  };

  const handleNodeUpdate = (nodeId, updates) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  };

  const handleNodeDelete = (nodeId) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(
        conn => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
      )
    }));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleConnectionAdd = (connection) => {
    setWorkflow(prev => ({
      ...prev,
      connections: [...(prev.connections || []), connection]
    }));
  };

  const handleConnectionDelete = (connectionId) => {
    setWorkflow(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    }));
  };

  const handleNodeDragStart = (e, node) => {
    e.dataTransfer.setData("node", JSON.stringify(node));
  };

  if (loading) {
    return <Loading type="canvas" />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Error 
          message={error} 
          onRetry={loadWorkflow} 
          type="workflow" 
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <WorkflowToolbar
        workflow={workflow}
        onSave={handleSave}
        onTest={handleTest}
        onDeploy={handleDeploy}
        onExecute={handleExecute}
        saving={saving}
        testing={testing}
        executing={executing}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <NodePalette onDragStart={handleNodeDragStart} />
        
        <div className="flex-1 flex flex-col">
          <WorkflowCanvas
            workflow={workflow}
            onNodeAdd={handleNodeAdd}
            onNodeUpdate={handleNodeUpdate}
            onNodeDelete={handleNodeDelete}
            onConnectionAdd={handleConnectionAdd}
            onConnectionDelete={handleConnectionDelete}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
          />
          
          <ExecutionPanel
            workflow={workflow}
            isVisible={showExecutionPanel}
            onToggle={() => setShowExecutionPanel(!showExecutionPanel)}
          />
        </div>
        
        {selectedNode && (
          <ConfigurationPanel
            selectedNode={selectedNode}
            onNodeUpdate={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;