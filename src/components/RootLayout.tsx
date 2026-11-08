import React from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { PageLayout } from "./PageLayout";
import Footer from "./Footer";

const PAGE_OWNS_FOOTER = new Set([
  "/",
  "/calculator",
  "/guides",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/accessibility",
]);

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <>
      <PageLayout>
        <ScrollRestoration />
        <Outlet />
      </PageLayout>
      {!PAGE_OWNS_FOOTER.has(pathname.replace(/\/$/, "") || "/") && (
        <div className="mx-auto w-full max-w-full px-4 pb-24 md:max-w-2xl md:pb-0 lg:max-w-4xl xl:max-w-6xl">
          <Footer compact />
        </div>
      )}
    </>
  );
};
