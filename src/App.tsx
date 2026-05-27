import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Redirect from "./pages/Redirect";
import Landing from "./pages/Landing";
import Layout from "./components/Layout";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProvider client={convex}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route path="/:slug" element={<Redirect />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </ConvexProvider>
    </ClerkProvider>
  );
}

export default App;
