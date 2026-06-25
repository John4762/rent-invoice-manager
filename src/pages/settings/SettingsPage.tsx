import { invoke } from "@tauri-apps/api/core";

import { AppContainer } from "@/components/common/AppContainer";
import { PageHeader } from "@/components/common/PageHeader";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function testArchive() {
  try {
    console.log("Before invoke");

    const count = await invoke<number>("get_archive_invoice_count");

    console.log("After invoke");

    console.log("Count:", count);

    alert(`Archive Count: ${count}`);
  } catch (error) {
    console.error(error);

    alert(`ERROR: ${String(error)}`);
  }
}

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

        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-400">
            Settings form will be implemented here.
          </p>

          <button
            onClick={testArchive}
            className="
    rounded-lg
    bg-red-500
    px-4
    py-2
    text-white
  "
          >
            TEST
          </button>
        </CardContent>
      </Card>
    </AppContainer>
  );
}
