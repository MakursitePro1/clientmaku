import { Suspense, lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { AdminGuard } from "@/components/AdminGuard";
import NotFound from "@/pages/NotFound";

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
 * Checks if the current wildcard slug matches the admin_slug from settings.
 * If it matches, renders the admin panel. Otherwise renders NotFound.
 */
export function AdminSlugChecker({ slug }: { slug: string }) {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return <Loading />;
  }

  const adminSlug = settings.admin_slug || "admingorohid306";

  if (slug !== adminSlug) {
    return <NotFound />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    </Suspense>
  );
}

export function getAdminChildRoutes() {
  return (
    <>
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
    </>
  );
}
