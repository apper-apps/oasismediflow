import nodeTemplatesData from "@/services/mockData/nodeTemplates.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const nodeService = {
  async getNodeTemplates() {
    await delay(200);
    return { ...nodeTemplatesData };
  },

  async getNodeTemplate(type) {
    await delay(150);
    const allNodes = [
      ...nodeTemplatesData.clinical,
      ...nodeTemplatesData.administrative,
      ...nodeTemplatesData.communication,
      ...nodeTemplatesData.data
    ];
    
    const template = allNodes.find(node => node.type === type);
    if (!template) {
      throw new Error("Node template not found");
    }
    return { ...template };
  },

  async validateNodeConfig(type, config) {
    await delay(300);
    const template = await this.getNodeTemplate(type);
    
    // Simple validation logic
    const errors = [];
    const requiredFields = template.config ? Object.keys(template.config) : [];
    
    requiredFields.forEach(field => {
      if (!config[field] && template.config[field] !== false && template.config[field] !== 0) {
        errors.push(`Missing required field: ${field}`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};