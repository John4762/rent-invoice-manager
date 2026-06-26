import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layout/AppLayout";
import { PrintEmailPage } from "@/pages/print-email/PrintEmailPage";
import { GenerateInvoicesPage } from "@/pages/generate-invoices/GenerateInvoicesPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { TenantsPage } from "@/pages/tenants/TenantsPage";
import { ArchivePage } from "@/pages/archive/ArchivePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
  path: "print-email",
  element: <PrintEmailPage />,
      },
      {
        index: true,
        element: <GenerateInvoicesPage />,
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
