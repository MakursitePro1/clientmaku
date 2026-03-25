import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { SEOHead } from "./SEOHead";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} path={location.pathname} type="website" />
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Tools
            </Button>
          </Link>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 card-shadow">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}