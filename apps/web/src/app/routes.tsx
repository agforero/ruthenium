import { App } from "@/app/App";
import NewProjectPage from "@/pages/NewProject";
import { Navigate, Route, Routes } from "react-router-dom";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/projects/new" element={<NewProjectPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
