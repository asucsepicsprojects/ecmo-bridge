"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentPatients = RecentPatients;
const card_1 = require("~/components/ui/card");
const table_1 = require("~/components/ui/table");
const button_1 = require("~/components/ui/button");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const server_1 = require("~/trpc/server");
async function RecentPatients() {
    // Fetch data from the server
    const patientsAll = await server_1.api.patient.get();
    const patients = patientsAll.slice(0, 5);
    return (<card_1.Card className="h-fit xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <card_1.CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <card_1.CardTitle>Patients</card_1.CardTitle>
          <card_1.CardDescription>Recent patients from your hospital.</card_1.CardDescription>
        </div>
        <button_1.Button asChild size="sm" className="ml-auto gap-1 bg-primary-purple-900">
          <link_1.default href="/bridge/patients-and-ecmos">
            View All
            <lucide_react_1.ArrowUpRight className="h-4 w-4"/>
          </link_1.default>
        </button_1.Button>
      </card_1.CardHeader>
      <card_1.CardContent>
        <table_1.Table>
          <table_1.TableHeader>
            <table_1.TableRow>
              <table_1.TableHead>Patient</table_1.TableHead>
              <table_1.TableHead className="xl:table-column">Type</table_1.TableHead>
              <table_1.TableHead className="xl:table-column">Special Care</table_1.TableHead>
              <table_1.TableHead className="xl:table-column">Age</table_1.TableHead>
            </table_1.TableRow>
          </table_1.TableHeader>
          <table_1.TableBody>
            {patients.map((patient) => {
            return (<table_1.TableRow key={patient.id}>
                  <table_1.TableCell>
                    <div className="font-medium">{patient.name}</div>
                  </table_1.TableCell>
                  <table_1.TableCell className=" xl:table-column">
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {patient.ecmoType
                    .toString()
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                    </div>
                  </table_1.TableCell>
                  <table_1.TableCell className=" xl:table-column">
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {patient.specialCare
                    .toString()
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                    </div>
                  </table_1.TableCell>
                  <table_1.TableCell className="text-left">{patient.age}</table_1.TableCell>
                </table_1.TableRow>);
        })}
          </table_1.TableBody>
        </table_1.Table>
      </card_1.CardContent>
    </card_1.Card>);
}
