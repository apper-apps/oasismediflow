import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Dashboard from "@/components/pages/Dashboard";
import WorkflowBuilder from "@/components/pages/WorkflowBuilder";
import TemplateGallery from "@/components/pages/TemplateGallery";

function App() {
  return (
    <>
<Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/workflow/:id" element={<WorkflowBuilder />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;