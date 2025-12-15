import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import { initializeAdminKit } from "../modules";
import "bootstrap/dist/css/bootstrap.min.css";
import "simplebar/dist/simplebar.min.css";
import "../admin.css";

const AdminLayout = () => {
  useEffect(() => {
    // Wait for React to render DOM first
    const timer = setTimeout(() => {
      initializeAdminKit();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="wrapper">
      <AdminSidebar />
      <div className="main">
        <AdminNavbar />
        <main className="content">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;

