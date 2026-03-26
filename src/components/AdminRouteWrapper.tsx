import { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { AdminGuard } from "@/components/AdminGuard";
import NotFound from "@/pages/NotFound";

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Checks if the current wildcard slug matches the admin_slug from settings.
 * Used with route: /:adminSlug/*
 */
export function AdminSlugChecker() {
  const { adminSlug } = useParams<{ adminSlug: string }>();
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return <Loading />;
  }

  const expectedSlug = settings.admin_slug || "admingorohid306";

  if (adminSlug !== expectedSlug) {
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
