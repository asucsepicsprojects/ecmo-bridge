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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { RecentPatients } from "../_components/recent-patients-card";
import { MatchedPatients } from "../_components/matched-patient-card";
import { PatientChart } from "../_components/charts";

// Mock data for dashboard
const mockData = {
  patientCount: 12, // Your hospital's patients
  totalPatientCount: 45, // Total patients across all hospitals
  ecmoCount: 8, // ECMO machines in your hospital
  matchCount: 15, // Total active matches
};

const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4  p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <UsersRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-6">
              <div className="text-2xl font-bold">{mockData.totalPatientCount}</div>
              <p className="text-xs text-muted-foreground">
                total patients currently need an ECMO
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Your Patients
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-6">
              <div className="text-2xl font-bold">{mockData.patientCount}</div>
              <p className="text-xs text-muted-foreground">
                patients from your hospital
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ECMO Machines
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-6">
              <div className="text-2xl font-bold">{mockData.ecmoCount}</div>
              <p className="text-xs text-muted-foreground">
                are machines from your hospital
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Actively Matched Patients
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-6">
              <div className="text-2xl font-bold">{mockData.matchCount}</div>
              <p className="text-xs text-muted-foreground">total matches</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <PatientChart />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <RecentPatients />
          <MatchedPatients />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
