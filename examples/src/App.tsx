import { Suspense, lazy } from "react";
import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ExampleContent from "./components/ExampleContent";

const HomePage = lazy(() => import("./components/Readme"));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
        basename={import.meta.env.VITE_BASE_URL}
      >
        <div className="app-container">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="main-content">
            <Routes>
              <Route path="/" Component={HomePage} />
              <Route path="/:exampleId" Component={ExampleContent} />
              <Route path="/*" element={null} />
            </Routes>
          </div>
        </div>
      </Router>
    </Suspense>
  );
};

export default App;
