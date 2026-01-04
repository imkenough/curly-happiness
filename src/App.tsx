import { ThemeProvider } from "@/components/theme-provider";
// import Page from "./app/dashboard/page"; // Removed direct import of Page
import { Routes, Route } from "react-router-dom";
import DashboardContent from "./app/dashboard/DashboardContent"; // New import
import ChartsPage from "./app/charts/page"; // Charts Page (will be rendered as a nested route)
import PageLayout from "./app/dashboard/page"; // Import the layout component, rename to avoid conflict

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/dashboard" element={<PageLayout />}> {/* Main dashboard route with layout */}
          <Route index element={<DashboardContent />} /> {/* Default content for /dashboard */}
          <Route path="charts" element={<ChartsPage />} /> {/* Nested charts route */}
        </Route>
        <Route path="/" element={<PageLayout />}> {/* Redirect root to dashboard layout */}
          <Route index element={<DashboardContent />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;