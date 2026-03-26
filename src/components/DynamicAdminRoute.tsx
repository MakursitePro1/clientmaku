import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
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

export function AdminRoutes() {
  const { settings, loading } = useSiteSettings();

  if (loading) return null;

  const slug = settings.admin_slug || "admingorohid306";

  return (
    <Route
      path={`/${slug}`}
      element={
        <Suspense fallback={<Loading />}>
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        </Suspense>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="tools" element={<AdminTools />} />
      <Route path="blog" element={<AdminBlog />} />
      <Route path="ads" element={<AdminAds />} />
      <Route path="seo" element={<AdminSEO />} />
      <Route path="custom-tools" element={<AdminCustomTools />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="roles" element={<AdminRoles />} />
      <Route path="security" element={<AdminSecurity />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  );
}
