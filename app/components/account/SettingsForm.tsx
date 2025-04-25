"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Settings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
  language: string;
}

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    language: "fr",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la sauvegarde des paramètres
  };

  return (
    <form onSubmit={handleSubmit} role="form" className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notifications</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Notifications par email</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir des mises à jour par email
            </p>
          </div>
          <input
            type="checkbox"
            role="switch"
            id="email-notifications"
            checked={settings.emailNotifications}
            onChange={(event) =>
              setSettings({
                ...settings,
                emailNotifications: event.target.checked,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sms-notifications">Notifications SMS</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir des notifications sur votre téléphone
            </p>
          </div>
          <Switch
            id="sms-notifications"
            checked={settings.smsNotifications}
            onChange={(event) =>
              setSettings({
                ...settings,
                smsNotifications: event.target.checked,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Préférences</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Mode sombre</Label>
            <p className="text-sm text-muted-foreground">
              Activer le thème sombre
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={settings.darkMode}
            onChange={(event) =>
              setSettings({ ...settings, darkMode: event.target.checked })
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Enregistrer les modifications</Button>
      </div>
    </form>
  );
}
