import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import TemplateCard from "@/components/molecules/TemplateCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { templateService } from "@/services/api/templateService";
import { workflowService } from "@/services/api/workflowService";

const TemplateGallery = () => {
  const navigate = useNavigate();
  
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [importing, setImporting] = useState(false);

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "patient-care", label: "Patient Care" },
    { value: "diagnostics", label: "Diagnostics" },
    { value: "administration", label: "Administration" },
    { value: "emergency", label: "Emergency" }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredTemplates(filtered);
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
  };

  const handleImport = async (template) => {
    try {
      setImporting(true);
      
      // Convert template to workflow format
      const workflowData = {
        name: `${template.name} (Copy)`,
        description: template.description,
        nodes: template.nodes.map(node => ({
          ...node,
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })),
        connections: template.connections.map(conn => ({
          ...conn,
          id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }))
      };

      const newWorkflow = await workflowService.create(workflowData);
      toast.success(`Template "${template.name}" imported successfully`);
      navigate(`/workflow/${newWorkflow.Id}`);
    } catch (err) {
      toast.error("Failed to import template");
    } finally {
      setImporting(false);
    }
  };

  const closePreview = () => {
    setSelectedTemplate(null);
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error 
          message={error} 
          onRetry={loadTemplates} 
          type="templates" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Template Gallery</h1>
            <p className="text-gray-600 mt-2">Pre-built workflows for common medical processes</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Templates
              </label>
              <div className="relative">
                <ApperIcon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="text"
                  placeholder="Search by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categories}
              />
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredTemplates.length}</span> templates found
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Empty 
            title="No templates found" 
            description="Try adjusting your search or filter criteria"
            icon="Layout"
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TemplateCard
                  template={template}
                  onPreview={handlePreview}
                  onImport={handleImport}
                  importing={importing}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Preview Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={closePreview}
            />
            <motion.div
              className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedTemplate.category}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={closePreview}
                  className="p-2"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Template Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                    <p className="text-gray-700 mb-6">{selectedTemplate.description}</p>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                    <ul className="space-y-2 mb-6">
                      {selectedTemplate.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ApperIcon name="CheckCircle" size={16} className="text-success-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedTemplate.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Template Structure */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Structure</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{selectedTemplate.nodes.length}</span> nodes, 
                        <span className="font-medium ml-1">{selectedTemplate.connections.length}</span> connections
                      </div>
                      
                      <div className="space-y-3">
                        {selectedTemplate.nodes.map((node, index) => (
                          <div key={node.id} className="flex items-center gap-3 p-3 bg-white rounded border">
                            <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center">
                              <ApperIcon name="Box" size={14} className="text-primary-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{node.type}</div>
                              <div className="text-sm text-gray-600">Node {index + 1}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleImport(selectedTemplate)}
                      disabled={importing}
                      className="w-full"
                    >
                      {importing ? (
                        <>
                          <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Download" size={16} className="mr-2" />
                          Import Template
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;