"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const server_1 = require("~/trpc/server");
const columns_1 = require("./columns");
const data_table_1 = require("./data-table");
const columns_2 = require("../patients/columns");
const data_table_2 = require("../patients/data-table");
const button_1 = require("~/components/ui/button");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const MachinesPage = async () => {
    try {
        const ecmos = await server_1.api.ecmo.get();
        const patients = await server_1.api.patient.get();
        return (<div className="flex flex-col justify-center space-y-2 p-4 md:p-10">
        <div className="p-2 lg:flex-row lg:space-x-2 lg:space-y-0">
          <data_table_2.PatientDataTable data={patients} columns={columns_2.PatientColumns}/>
          <data_table_1.ECMODataTable data={ecmos} columns={columns_1.ECMOColumns}/>
        </div>
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
exports.default = MachinesPage;
