import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/lib/apollo-client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sidebar from "@/components/Sidebar";
import SensorOverview from "./pages/SensorOverview";
import SensorAlerts from "./pages/SensorAlerts";
import SensorHistory from "./pages/SensorHistory";

const queryClient = new QueryClient();

const App = () => (
  <ApolloProvider client={apolloClient}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sensor/:sensorId/overview" element={<SensorOverview />} />
                <Route path="/sensor/:sensorId/alerts" element={<SensorAlerts />} />
                <Route path="/sensor/:sensorId/history" element={<SensorHistory />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ApolloProvider>
);

export default App;