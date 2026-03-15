import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { Admin } from "./pages/Admin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Crypto } from "./pages/Crypto";
import { Earn } from "./pages/Earn";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { News } from "./pages/News";
import { Signup } from "./pages/Signup";
import { Trading } from "./pages/Trading";
import { Vlog } from "./pages/Vlog";
import { Wallet } from "./pages/Wallet";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const cryptoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/crypto",
  component: Crypto,
});
const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: News,
});
const tradingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trading",
  component: Trading,
});
const vlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vlog",
  component: Vlog,
});
const earnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/earn",
  component: Earn,
});
const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: Wallet,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: Signup,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});
const adminDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  cryptoRoute,
  newsRoute,
  tradingRoute,
  vlogRoute,
  earnRoute,
  walletRoute,
  loginRoute,
  signupRoute,
  adminRoute,
  adminDashRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="skl-theme"
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
