import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const closeSidebar = () => {
    setSidebarActive(false);
  };

  return (
    <div className="app-layout">
      <Sidebar active={sidebarActive} onClose={closeSidebar} />
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "var(--sidebar-width)", transition: "margin 0.3s ease" }}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="p-4 flex-grow-1">
          {children}
        </main>
      </div>
      {/* Overlay for mobile sidebar */}
      {sidebarActive && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none" 
          style={{ zIndex: 999 }}
          onClick={closeSidebar}
        ></div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .flex-grow-1 {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Layout;
