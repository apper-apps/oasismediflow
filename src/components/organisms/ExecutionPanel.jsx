import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";

const ExecutionPanel = ({ 
  workflow, 
  isVisible, 
  onToggle 
}) => {
  const [executions, setExecutions] = useState([]);
  const [selectedExecution, setSelectedExecution] = useState(null);

  // Mock execution data
  useEffect(() => {
    if (workflow) {
      const mockExecutions = [
        {
          id: "exec-1",
          status: "success",
          startTime: new Date(Date.now() - 300000).toISOString(),
          endTime: new Date(Date.now() - 240000).toISOString(),
          nodesExecuted: workflow.nodes?.length || 0,
          errors: []
        },
        {
          id: "exec-2",
          status: "running",
          startTime: new Date(Date.now() - 60000).toISOString(),
          endTime: null,
          nodesExecuted: 2,
          errors: []
        }
      ];
      setExecutions(mockExecutions);
    }
  }, [workflow]);

  const getStatusColor = (status) => {
    switch (status) {
      case "success": return "text-success-500 bg-success-100";
      case "error": return "text-error-500 bg-error-100";
      case "running": return "text-warning-500 bg-warning-100";
      default: return "text-gray-500 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success": return "CheckCircle";
      case "error": return "XCircle";
      case "running": return "Loader2";
      default: return "Clock";
    }
  };

  const getDuration = (start, end) => {
    if (!end) return "Running...";
    const duration = new Date(end) - new Date(start);
    return `${Math.round(duration / 1000)}s`;
  };

  if (!isVisible) {
    return (
      <div className="bg-white border-t border-gray-200 p-3">
        <Button
          variant="ghost"
          icon="ChevronUp"
          onClick={onToggle}
          className="w-full justify-center"
        >
          Show Execution Logs
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: 300 }}
      exit={{ height: 0 }}
      className="bg-white border-t border-gray-200 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Execution Logs</h3>
        <Button
          variant="ghost"
          icon="ChevronDown"
          onClick={onToggle}
        />
      </div>

      <div className="flex h-64">
        {/* Execution list */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
          {executions.length === 0 ? (
            <Empty 
              type="execution"
              actionLabel="Run Workflow"
            />
          ) : (
            <div className="p-2 space-y-2">
              {executions.map((execution) => (
                <motion.div
                  key={execution.id}
                  onClick={() => setSelectedExecution(execution)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedExecution?.id === execution.id
                      ? "border-primary-300 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {execution.id}
                    </span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                      <div className="flex items-center gap-1">
                        <ApperIcon 
                          name={getStatusIcon(execution.status)} 
                          className={`w-3 h-3 ${execution.status === "running" ? "animate-spin" : ""}`} 
                        />
                        {execution.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{getDuration(execution.startTime, execution.endTime)}</span>
                    <span>{execution.nodesExecuted} nodes</span>
                    <span>{formatDistanceToNow(new Date(execution.startTime), { addSuffix: true })}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Execution details */}
        <div className="w-1/2 p-4">
          {selectedExecution ? (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Execution Details</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedExecution.status)}`}>
                    {selectedExecution.status}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="text-gray-900">
                    {getDuration(selectedExecution.startTime, selectedExecution.endTime)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Nodes Executed:</span>
                  <span className="text-gray-900">{selectedExecution.nodesExecuted}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Started:</span>
                  <span className="text-gray-900">
                    {formatDistanceToNow(new Date(selectedExecution.startTime), { addSuffix: true })}
                  </span>
                </div>
                
                {selectedExecution.errors.length > 0 && (
                  <div>
                    <span className="text-gray-500 block mb-2">Errors:</span>
                    <div className="bg-error-50 border border-error-200 rounded p-2">
                      {selectedExecution.errors.map((error, index) => (
                        <p key={index} className="text-error-700 text-xs">{error}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <ApperIcon name="FileText" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Select an execution to view details</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExecutionPanel;