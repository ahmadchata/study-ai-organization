import "./App.css";
import AllRoutes from "./routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Context/AuthContext";
import { SnackbarProvider } from "notistack";

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
  );
}

export default App;
