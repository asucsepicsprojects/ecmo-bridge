"use client";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { RecentPatients } from "../_components/recent-patients-card";
import { MatchedPatients } from "../_components/matched-patient-card";
import { PatientChart } from "../_components/charts";

// Mock data for dashboard
const mockData = {
  patientCount: 12,
  totalPatientCount: 45,
  ecmoCount: 8,
  matchCount: 15,
  recentActivity: [
    { type: "match", description: "New match created", time: "2m ago" },
    { type: "patient", description: "Patient status updated", time: "5m ago" },
    { type: "ecmo", description: "ECMO machine added", time: "10m ago" },
  ],
  alerts: [
    { type: "warning", message: "Low ECMO availability", time: "1h ago" },
    { type: "info", message: "New patient added", time: "2h ago" },
  ],
};

const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Quick Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <UsersRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.totalPatientCount}</div>
              <p className="text-xs text-muted-foreground">
                total patients currently need an ECMO
              </p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>12% increase</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Your Patients
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.patientCount}</div>
              <p className="text-xs text-muted-foreground">
                patients from your hospital
              </p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>5% increase</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ECMO Machines
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.ecmoCount}</div>
              <p className="text-xs text-muted-foreground">
                available machines in your hospital
              </p>
              <div className="mt-2 flex items-center text-xs text-red-600">
                <ArrowUpRight className="h-3 w-3 rotate-180" />
                <span>3% decrease</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Matches
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.matchCount}</div>
              <p className="text-xs text-muted-foreground">
                current active matches
              </p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>8% increase</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
              <CardDescription>Distribution of patients by type and status</CardDescription>
            </CardHeader>
            <CardContent>
              <PatientChart />
            </CardContent>
          </Card>
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates in the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Important notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="rounded-full bg-red-100 p-2">
                      <Activity className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <RecentPatients />
            <MatchedPatients />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
