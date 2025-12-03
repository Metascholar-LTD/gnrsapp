import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col resume-builder-app">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20 resume-builder-main">{children}</main>
    </div>
  );
};

export default Layout;

