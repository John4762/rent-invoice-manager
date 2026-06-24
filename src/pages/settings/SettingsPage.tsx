import { AppContainer } from "@/components/common/AppContainer";
import { PageHeader } from "@/components/common/PageHeader";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SettingsPage() {
  return (
    <AppContainer>
      <PageHeader
        title="Settings"
        description="Manage your application settings."
      />

      <Card
        className="
    border-zinc-700
    bg-zinc-800/50
    backdrop-blur-sm
    shadow-lg
  "
      >
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>

          <CardDescription>
            Configure landlord details, email settings and invoice preferences.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-zinc-400">
            Settings form will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AppContainer>
  );
}
