"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    frequency: "daily",
    emailAlert: false,
  });
  const fetchSettings = async () => {
    const response = await fetch("/api/setting/fetch", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      setIsLoading(false);
      toast.error("Failed to fetch settings");
      return;
    }
    const data = await response.json();
    setSettings({
      frequency: data.data.setting.frequency,
      emailAlert: data.data.setting.emailAlert,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    setIsLoading(true);
    fetchSettings();
    toast.success("Settings fetched successfully");
  }, []);
  interface Settings {
    frequency: string;
    emailAlert: boolean;
  }

  interface ApiResponse {
    data: {
      setting: Settings;
    };
  }

  const updateSettings = async (newSettings: Settings): Promise<void> => {
    const response = await fetch("/api/setting/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSettings),
    });
    if (!response.ok) {
      toast.error("Failed to update settings");
      return;
    }
    const data: ApiResponse = await response.json();
    setSettings(data.data.setting);
    toast.success("Settings updated successfully");
  };
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your price tracking preferences
            </p>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader className="w-6 h-6 mx-auto my-4 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure your default preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label>Price Check Frequency</Label>

                    <div className="relative">
                      <select
                        className="w-full mt-1 p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                        value={settings.frequency}
                        onChange={async (e) => {
                          const newSettings = {
                            ...settings,
                            frequency: e.target.value,
                          };
                          setSettings(newSettings);
                          await updateSettings(newSettings);
                        }}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>

                      {/* Custom Arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Control how you receive alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Discord Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get alerts in Discord
                      </p>
                    </div>
                    <Input
                      type="checkbox"
                      defaultChecked
                      className="w-auto cursor-pointer"
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get email alerts
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle cursor-pointer"
                      checked={settings.emailAlert}
                      onChange={(e) => {
                        const newSettings = {
                          ...settings,
                          emailAlert: e.target.checked,
                        };
                        setSettings(newSettings);
                        updateSettings(newSettings);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
