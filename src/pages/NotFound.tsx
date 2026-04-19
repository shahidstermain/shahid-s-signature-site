import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Seo } from "@/components/seo/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        description="The requested page could not be found."
        noindex
        path={location.pathname}
        title="Page not found"
      />
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="mb-4 text-4xl md:text-5xl font-heading font-bold">404</h1>
          <p className="mb-2 text-xl text-muted-foreground">Page not found</p>
          <p className="mb-8 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
