"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const button_1 = require("~/components/ui/button");
const card_1 = require("~/components/ui/card");
const recent_patients_card_1 = require("../_components/recent-patients-card");
const server_1 = require("~/trpc/server");
const matched_patient_card_1 = require("../_components/matched-patient-card");
const charts_1 = require("../_components/charts");
const Dashboard = async () => {
    try {
        const patientCount = (await server_1.api.patient.get()).length;
        const totalPatientCount = (await server_1.api.patient.getAll()).length;
        const ecmoCount = (await server_1.api.ecmo.get()).length;
        const matchCount = await server_1.api.match.fetchMatchCount();
        return (<div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4  p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <card_1.Card x-chunk="dashboard-01-chunk-0">
              <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <card_1.CardTitle className="text-sm font-medium">
                  Total Patients
                </card_1.CardTitle>
                <lucide_react_1.UsersRound className="h-4 w-4 text-muted-foreground"/>
              </card_1.CardHeader>
              <card_1.CardContent className="px-6">
                <div className="text-2xl font-bold">{totalPatientCount}</div>
                <p className="text-xs text-muted-foreground">
                  total patients currently need an ECMO
                </p>
              </card_1.CardContent>
            </card_1.Card>
            <card_1.Card x-chunk="dashboard-01-chunk-1">
              <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <card_1.CardTitle className="text-sm font-medium">
                  Your Patients
                </card_1.CardTitle>
                <lucide_react_1.UserCheck className="h-4 w-4 text-muted-foreground"/>
              </card_1.CardHeader>
              <card_1.CardContent className="px-6">
                <div className="text-2xl font-bold">{patientCount}</div>
                <p className="text-xs text-muted-foreground">
                  patients from your hospital
                </p>
              </card_1.CardContent>
            </card_1.Card>
            <card_1.Card x-chunk="dashboard-01-chunk-2">
              <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <card_1.CardTitle className="text-sm font-medium">
                  ECMO Machines
                </card_1.CardTitle>
                <lucide_react_1.CreditCard className="h-4 w-4 text-muted-foreground"/>
              </card_1.CardHeader>
              <card_1.CardContent className="px-6">
                <div className="text-2xl font-bold">{ecmoCount}</div>
                <p className="text-xs text-muted-foreground">
                  are machines from your hospital
                </p>
              </card_1.CardContent>
            </card_1.Card>
            <card_1.Card x-chunk="dashboard-01-chunk-3">
              <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <card_1.CardTitle className="text-sm font-medium">
                  Actively Matched Patietns
                </card_1.CardTitle>
                <lucide_react_1.Activity className="h-4 w-4 text-muted-foreground"/>
              </card_1.CardHeader>
              <card_1.CardContent className="px-6">
                <div className="text-2xl font-bold">{matchCount}</div>
                <p className="text-xs text-muted-foreground">total matches</p>
              </card_1.CardContent>
            </card_1.Card>
          </div>
          <div>
            <charts_1.PatientChart />
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <recent_patients_card_1.RecentPatients />
            <matched_patient_card_1.MatchedPatients />
          </div>
        </main>
      </div>);
    }
    catch (e) {
        return (<div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <h1>You cannot access this yet.</h1>
        <button_1.Button asChild size="sm" className="gap-1 bg-primary-purple-900">
          <link_1.default href="/bridge/settings">
            Settings
            <lucide_react_1.ArrowUpRight className="h-4 w-4"/>
          </link_1.default>
        </button_1.Button>
      </div>);
    }
};
exports.default = Dashboard;
