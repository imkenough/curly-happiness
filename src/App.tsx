import { ThemeProvider } from "@/components/theme-provider";
import { Routes, Route } from "react-router-dom";
import DashboardContent from "./app/dashboard/DashboardContent";
import ChartsPage from "./app/charts/page";
import EventLogsPage from "./app/dashboard/event-logs/page"; // New import
import PageLayout from "./app/dashboard/page";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/dashboard" element={<PageLayout />}>
          <Route index element={<DashboardContent />} />
          <Route path="charts" element={<ChartsPage />} />
          <Route path="event-logs" element={<EventLogsPage />} /> {/* New nested route */}
        </Route>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<DashboardContent />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;