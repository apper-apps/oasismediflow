import workflowsData from "@/services/mockData/workflows.json";

let workflows = [...workflowsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const workflowService = {
  async getAll() {
    await delay(300);
    return [...workflows];
  },

  async getById(id) {
    await delay(200);
    const workflow = workflows.find(w => w.Id === parseInt(id));
    if (!workflow) {
      throw new Error("Workflow not found");
    }
    return { ...workflow };
  },

  async create(workflowData) {
    await delay(400);
    const newWorkflow = {
      Id: Math.max(...workflows.map(w => w.Id), 0) + 1,
      ...workflowData,
      version: 1,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: workflowData.nodes || [],
      connections: workflowData.connections || []
    };
    workflows.push(newWorkflow);
    return { ...newWorkflow };
  },

  async update(id, workflowData) {
    await delay(350);
    const index = workflows.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Workflow not found");
    }
    
    workflows[index] = {
      ...workflows[index],
      ...workflowData,
      updatedAt: new Date().toISOString()
    };
    return { ...workflows[index] };
  },

  async delete(id) {
    await delay(250);
    const index = workflows.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Workflow not found");
    }
    
    workflows.splice(index, 1);
    return true;
  },

  async executeWorkflow(id) {
    await delay(2000);
    const workflow = workflows.find(w => w.Id === parseInt(id));
    if (!workflow) {
      throw new Error("Workflow not found");
    }
    
    // Simulate execution results
    return {
      executionId: `exec-${Date.now()}`,
      status: "success",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 1500).toISOString(),
      nodesExecuted: workflow.nodes.length,
      errors: []
    };
  },

  async testWorkflow(id) {
    await delay(1500);
    const workflow = workflows.find(w => w.Id === parseInt(id));
    if (!workflow) {
      throw new Error("Workflow not found");
    }
    
    return {
      testId: `test-${Date.now()}`,
      status: "success",
      validationResults: {
        syntax: "passed",
        connections: "passed",
        configuration: "passed"
      },
      warnings: []
    };
  }
};