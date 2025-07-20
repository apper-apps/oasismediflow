import templatesData from "@/services/mockData/templates.json";

let templates = [...templatesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const templateService = {
  async getAll() {
    await delay(300);
    return [...templates];
  },

  async getById(id) {
    await delay(200);
    const template = templates.find(t => t.Id === parseInt(id));
    if (!template) {
      throw new Error("Template not found");
    }
    return { ...template };
  },

  async getByCategory(category) {
    await delay(250);
    return templates.filter(t => t.category === category);
  },

  async searchTemplates(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return templates.filter(t => 
      t.name.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
};