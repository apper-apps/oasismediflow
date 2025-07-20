import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { nodeService } from "@/services/api/nodeService";

const ConfigurationPanel = ({ 
  selectedNode, 
  onNodeUpdate, 
  onClose 
}) => {
  const [config, setConfig] = useState({});
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.config || {});
      loadTemplate();
    }
  }, [selectedNode]);

  const loadTemplate = async () => {
    if (!selectedNode) return;
    
    try {
      setLoading(true);
      const nodeTemplate = await nodeService.getNodeTemplate(selectedNode.type);
      setTemplate(nodeTemplate);
    } catch (err) {
      console.error("Failed to load template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
  };

  const handleSave = () => {
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { config });
    }
  };

  const renderConfigField = (field, defaultValue) => {
    const value = config[field] ?? defaultValue;
    
    // Determine field type based on field name and default value
    if (typeof defaultValue === "boolean") {
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={field}
            checked={value}
            onChange={(e) => handleConfigChange(field, e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <label htmlFor={field} className="text-sm font-medium text-gray-700">
            {field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
          </label>
        </div>
      );
    }
    
    if (field.includes("Type") || field.includes("Method") || field.includes("Format")) {
      const options = getFieldOptions(field);
      return (
        <FormField
          label={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
          type="select"
          value={value}
          onChange={(e) => handleConfigChange(field, e.target.value)}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </FormField>
      );
    }
    
    if (field.includes("notes") || field.includes("message")) {
      return (
        <FormField
          label={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
          type="textarea"
          value={value}
          onChange={(e) => handleConfigChange(field, e.target.value)}
          placeholder={`Enter ${field}...`}
        />
      );
    }
    
    return (
      <FormField
        label={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
        value={value}
        onChange={(e) => handleConfigChange(field, e.target.value)}
        placeholder={`Enter ${field}...`}
      />
    );
  };

  const getFieldOptions = (field) => {
    const optionMap = {
      method: ["email", "sms", "push"],
      format: ["pdf", "html", "csv"],
      urgency: ["low", "normal", "high", "urgent"],
      codingSystem: ["ICD-10", "ICD-11", "CPT"],
      inputFormat: ["HL7", "FHIR", "CSV", "JSON"],
      outputFormat: ["HL7", "FHIR", "CSV", "JSON"],
      operator: ["and", "or"],
      specialty: ["cardiology", "neurology", "oncology", "orthopedics", "dermatology"]
    };
    
    return optionMap[field] || ["option1", "option2", "option3"];
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <ApperIcon name="Settings" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Select a node to configure</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      className="w-80 bg-white border-l border-gray-200 flex flex-col h-full"
    >
      {/* Panel header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClose}
          />
        </div>
        
        {template && (
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: template.color }}
            >
              <ApperIcon name={template.icon} className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              <p className="text-xs text-gray-500">{template.category}</p>
            </div>
          </div>
        )}
      </div>

      {/* Configuration form */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : template ? (
          <div className="space-y-4">
            {Object.entries(template.config || {}).map(([field, defaultValue]) => (
              <div key={field}>
                {renderConfigField(field, defaultValue)}
              </div>
            ))}
            
            {Object.keys(template.config || {}).length === 0 && (
              <div className="text-center py-8">
                <ApperIcon name="Settings" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500 text-sm">No configuration options available</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Panel footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfigurationPanel;