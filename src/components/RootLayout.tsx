import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { PageLayout } from "./PageLayout";

export const RootLayout: React.FC = () => {
  return (
    <PageLayout>
      <ScrollRestoration />
      <Outlet />
    </PageLayout>
  );
};
