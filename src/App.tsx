import { ThemeProvider } from "@/components/theme-provider";
import Page from "./app/dashboard/page";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <div className="flex items-center justify-center min-h-screen">
        <div className="font-medium">Hello World</div>
      </div> */}
      <Page></Page>
    </ThemeProvider>
  );
}

export default App;
