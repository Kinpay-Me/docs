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
    <BrowserRouter basename="/docs">
      <Routes>
        <Route path="/" element={<Navigate to="/overview/intro" replace />} />
        <Route
          path="/:categoryId/:sectionId"
          element={
            <DocsProvider config={{
              ...docsConfig,
              logo,
              theme: {
                primary: "#9742E7",
                primaryDark: "#B47BF0",
                light: {
                  background: "#FFFFFF",
                  foreground: "#1A0F2E",
                  card: "#FFFFFF",
                  "card-foreground": "#1A0F2E",
                  primary: "#9742E7",
                  "primary-foreground": "#FFFFFF",
                  muted: "#F2EFFE",
                  "muted-foreground": "#9580B3",
                  border: "#E4DAF5",
                  sidebar: "#FFFFFF",
                  "sidebar-foreground": "#1A0F2E",
                  "sidebar-border": "#E4DAF5",
                  "sidebar-accent": "#F2EFFE",
                  "sidebar-accent-foreground": "#1A0F2E",
                },
                dark: {
                  background: "#120A1E",
                  foreground: "#F0EAFF",
                  card: "#1E1430",
                  "card-foreground": "#F0EAFF",
                  primary: "#B47BF0",
                  "primary-foreground": "#FFFFFF",
                  muted: "#261A3A",
                  "muted-foreground": "#8B77A8",
                  border: "#2E1F47",
                  sidebar: "#1E1430",
                  "sidebar-foreground": "#F0EAFF",
                  "sidebar-border": "#2E1F47",
                  "sidebar-accent": "#261A3A",
                  "sidebar-accent-foreground": "#F0EAFF",
                },
              },
            }}>
              <DocsViewer />
            </DocsProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
