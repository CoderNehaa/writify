import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import from files
import { ROUTES_PATH } from "./utils/routesPath";
import { getProfileService } from "./api/user";
import useAuthStore from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Membership from "./pages/Membership";
import WriteArticle from "./pages/WriteArticle";
import NotFound from "./pages/NotFound";
import Verify from "./pages/Verify";

const App = () => {
  const { setCurrentUser, setIsInitializing } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProfileService();
        setCurrentUser(res.data);
      } catch {
        setCurrentUser(null);
      } finally {
        setIsInitializing(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path={ROUTES_PATH.ARTICLE.ROOT} element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path={ROUTES_PATH.CATEGORIES} element={<Categories />} />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES_PATH.SETTINGS}
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES_PATH.ARTICLE.WRITE}
            element={
              <ProtectedRoute>
                <WriteArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/write/:id"
            element={
              <ProtectedRoute>
                <WriteArticle />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES_PATH.AUTH.LOGIN} element={<Auth />} />
          <Route path={ROUTES_PATH.AUTH.VERIFY} element={<Verify />} />
          <Route path={ROUTES_PATH.ABOUT} element={<About />} />
          <Route path={ROUTES_PATH.CONTACT} element={<Contact />} />
          <Route path={ROUTES_PATH.PRIVACY} element={<Privacy />} />
          <Route path={ROUTES_PATH.TERMS} element={<Terms />} />
          <Route path={ROUTES_PATH.MEMBERSHIP} element={<Membership />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer autoClose={2000} limit={1} />
    </TooltipProvider>
  );
};

export default App;
