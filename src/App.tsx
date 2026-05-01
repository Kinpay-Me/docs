import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DocsProvider, DocsViewer } from "@jestrux/docs-viewer";
import "@jestrux/docs-viewer/styles";
import { docsConfig } from "./docs-config";
import { LogoMark } from "./LogoMark";

const logo = (
  <div
    style={{ backgroundColor: "#D5FA31" }}
    className="size-9 rounded-lg flex items-center justify-center shadow-sm"
  >
    <span style={{ color: "#1A0F2E" }}>
      <LogoMark size={20} />
    </span>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/overview/intro" replace />} />
        <Route
          path="/:categoryId/:sectionId"
          element={
            <DocsProvider config={{ ...docsConfig, logo }}>
              <DocsViewer />
            </DocsProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
