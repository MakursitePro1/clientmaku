import { Suspense, lazy, useMemo } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { AdminGuard } from "@/components/AdminGuard";

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminTools = lazy(() => import("@/pages/admin/AdminTools"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminSecurity = lazy(() => import("@/pages/admin/AdminSecurity"));
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog"));
const AdminAds = lazy(() => import("@/pages/admin/AdminAds"));
const AdminRoles = lazy(() => import("@/pages/admin/AdminRoles"));
const AdminSEO = lazy(() => import("@/pages/admin/AdminSEO"));
const AdminCustomTools = lazy(() => import("@/pages/admin/AdminCustomTools"));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Renders admin panel routes dynamically based on admin_slug from site_settings.
 * Place this as a catch-all BEFORE the 404 route.
 */
export function DynamicAdminRouter() {
  const { settings, loading } = useSiteSettings();
  const location = useLocation();

  const slug = settings.admin_slug || "admingorohid306";
  const adminBase = `/${slug}`;

  // Check if current path matches admin slug
  const isAdminPath = location.pathname === adminBase || location.pathname.startsWith(`${adminBase}/`);

  if (loading || !isAdminPath) {
    return null;
  }

  // Get the sub-path after the admin slug
  const subPath = location.pathname.slice(adminBase.length) || "/";

  return (
    <Suspense fallback={<Loading />}>
      <AdminGuard>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/tools" element={<AdminTools />} />
            <Route path="/blog" element={<AdminBlog />} />
            <Route path="/ads" element={<AdminAds />} />
            <Route path="/seo" element={<AdminSEO />} />
            <Route path="/custom-tools" element={<AdminCustomTools />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/roles" element={<AdminRoles />} />
            <Route path="/security" element={<AdminSecurity />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </AdminLayout>
      </AdminGuard>
    </Suspense>
  );
}
