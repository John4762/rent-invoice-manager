import { useState } from "react";

import { Pencil } from "lucide-react";
import { AppContainer } from "@/components/common/AppContainer";
import { PageHeader } from "@/components/common/PageHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);

  const [landlordName, setLandlordName] = useState("A J Properties");

  const [pan, setPan] = useState("");
  const [gstin, setGstin] = useState("");
  const [address, setAddress] = useState("");

  const [invoicePrefix, setInvoicePrefix] = useState("AJ");

  const [recipientEmail, setRecipientEmail] = useState("");

  const [senderEmail, setSenderEmail] = useState("");

  const [gmailAppPassword, setGmailAppPassword] = useState("");

  return (
    <AppContainer>
      <PageHeader
        title="Settings"
        description="Manage landlord, invoice and email configuration."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Landlord Information
              </CardTitle>

              <p className="text-sm text-zinc-400">
                Information displayed on generated invoices.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-zinc-300">Landlord Name</Label>

                <Input
                  className="h-11 text-white disabled:opacity-70"
                  readOnly={!isEditing}
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">PAN</Label>

                  <Input
                    className="h-11 text-white disabled:opacity-70"
                    readOnly={!isEditing}
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-300">GSTIN</Label>

                  <Input
                    className="h-11 text-white disabled:opacity-70"
                    readOnly={!isEditing}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Address</Label>

                <Textarea
                  className="min-h-28 text-white disabled:opacity-70"
                  readOnly={!isEditing}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Invoice Configuration
              </CardTitle>

              <p className="text-sm text-zinc-400">
                Configure invoice numbering defaults.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="max-w-xs space-y-2">
                <Label className="text-zinc-300">Invoice Prefix</Label>

                <Input
                  className="h-11 text-white disabled:opacity-70"
                  readOnly={!isEditing}
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                />

                <p className="text-xs text-zinc-500">Example: AJ/CP/3/26-27</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Email Configuration
              </CardTitle>

              <p className="text-sm text-zinc-400">
                Configure email delivery settings.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-zinc-300">Recipient Email</Label>

                <Input
                  className="h-11 text-white disabled:opacity-70"
                  readOnly={!isEditing}
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="praji@example.com"
                />

                <p className="text-xs text-zinc-500">
                  All generated invoices will be sent to this email address.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Sender Email</Label>

                <Input
                  className="h-11 text-white disabled:opacity-70"
                  readOnly={!isEditing}
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="yourgmail@gmail.com"
                />

                <p className="text-xs text-zinc-500">
                  Gmail account used to send invoices.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Gmail App Password</Label>

                <Input
                  className="h-11 text-white disabled:opacity-70"
                  readOnly={!isEditing}
                  type="password"
                  value={gmailAppPassword}
                  onChange={(e) => setGmailAppPassword(e.target.value)}
                />

                <p className="text-xs text-zinc-500">
                  Generated from your Google Account security settings.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <div className="font-medium text-white">
                  {isEditing ? "Editing Settings" : "Settings Locked"}
                </div>

                <div className="text-sm text-zinc-400">
                  {isEditing
                    ? "Make your changes and save them."
                    : "Click Edit Settings to modify application settings."}
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setIsEditing(!isEditing)}
                className={
                  isEditing
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "bg-emerald-600 text-white hover:bg-emerald-500"
                }
              >
                <Pencil className="mr-2 h-4 w-4" />

                {isEditing ? "Save Changes" : "Edit Settings"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppContainer>
  );
}
