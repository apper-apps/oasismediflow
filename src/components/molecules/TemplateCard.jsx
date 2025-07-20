import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const TemplateCard = ({ template, onPreview, onImport, importing }) => {
  const categoryColors = {
    "patient-care": "bg-primary-100 text-primary-700",
    "diagnostics": "bg-success-100 text-success-700",
    "administration": "bg-warning-100 text-warning-700",
    "emergency": "bg-error-100 text-error-700"
  };

  const categoryIcons = {
    "patient-care": "Heart",
    "diagnostics": "Activity",
    "administration": "FileText",
    "emergency": "AlertTriangle"
  };

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-node transition-all duration-200"
      whileHover={{ y: -2 }}
    >
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-2">{template.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{template.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ml-4 flex-shrink-0 ${categoryColors[template.category] || 'bg-gray-100 text-gray-700'}`}>
            <ApperIcon 
              name={categoryIcons[template.category] || "Box"} 
              size={12} 
              className="inline mr-1" 
            />
            {template.category}
          </div>
        </div>

        {/* Template Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ApperIcon name="Box" size={14} />
            <span>{template.nodes.length} nodes</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Link" size={14} />
            <span>{template.connections.length} connections</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" size={14} />
            <span>{template.estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Features Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {template.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <ApperIcon name="CheckCircle" size={12} className="text-success-500 mt-1 flex-shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
            {template.features.length > 3 && (
              <li className="text-sm text-gray-500">
                +{template.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onPreview(template)}
            className="flex-1 text-sm"
          >
            <ApperIcon name="Eye" size={14} className="mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => onImport(template)}
            disabled={importing}
            className="flex-1 text-sm"
          >
            {importing ? (
              <>
                <ApperIcon name="Loader2" size={14} className="mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <ApperIcon name="Download" size={14} className="mr-2" />
                Import
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateCard;