import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layout/AppLayout";

import { GenerateInvoicesPage } from "@/pages/generate-invoices/GenerateInvoicesPage";
import { PreviewInvoicesPage } from "@/pages/preview-invoices/PreviewInvoicesPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { TenantsPage } from "@/pages/tenants/TenantsPage";
import { ArchivePage } from "@/pages/archive/ArchivePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <GenerateInvoicesPage />,
      },
      {
        path: "preview",
        element: <PreviewInvoicesPage />,
      },
      {
        path: "archive",
        element: <ArchivePage />,
      },
      {
        path: "tenants",
        element: <TenantsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
