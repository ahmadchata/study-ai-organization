import "./App.css";
import AllRoutes from "./routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Context/AuthContext";
import { SnackbarProvider } from "notistack";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./components/Error/ErrorPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <AllRoutes />
          </SnackbarProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
