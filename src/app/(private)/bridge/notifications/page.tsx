"use client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  Bell,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "alert",
    title: "Low ECMO Availability",
    message: "Only 2 ECMO machines available in your hospital",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "New Match Created",
    message: "Patient John Doe matched with ECMO machine #123",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "System Update",
    message: "New features added to the dashboard",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
  {
    id: 4,
    type: "error",
    title: "Connection Error",
    message: "Failed to sync with central database",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "alert":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const NotificationsPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-lg p-4 ${
                    !notification.read ? "bg-muted" : ""
                  }`}
                >
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notification.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <Badge variant="secondary">New</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NotificationsPage; 