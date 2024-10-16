"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientChart = PatientChart;
const react_1 = require("~/trpc/react");
const react_2 = require("@tremor/react");
const react_3 = __importDefault(require("react"));
function PatientChart() {
    const pediatricCount1 = react_1.api.patient.getBy.useQuery({
        specialCare: "PEDIATRIC",
        ecmoType: "ECPR",
    }).data?.length;
    const pediatricCount2 = react_1.api.patient.getBy.useQuery({
        specialCare: "PEDIATRIC",
        ecmoType: "PULMONARY",
    }).data?.length;
    const pediatricCount3 = react_1.api.patient.getBy.useQuery({
        specialCare: "PEDIATRIC",
        ecmoType: "CARDIAC",
    }).data?.length;
    const pregnantCount1 = react_1.api.patient.getBy.useQuery({
        specialCare: "PREGNANT_PATIENTS",
        ecmoType: "ECPR",
    }).data?.length;
    const pregnantCount2 = react_1.api.patient.getBy.useQuery({
        specialCare: "PREGNANT_PATIENTS",
        ecmoType: "PULMONARY",
    }).data?.length;
    const pregnantCount3 = react_1.api.patient.getBy.useQuery({
        specialCare: "PREGNANT_PATIENTS",
        ecmoType: "CARDIAC",
    }).data?.length;
    const firstResponderCount1 = react_1.api.patient.getBy.useQuery({
        specialCare: "FIRST_RESPONDERS",
        ecmoType: "ECPR",
    }).data?.length;
    const firstResponderCount2 = react_1.api.patient.getBy.useQuery({
        specialCare: "FIRST_RESPONDERS",
        ecmoType: "PULMONARY",
    }).data?.length;
    const firstResponderCount3 = react_1.api.patient.getBy.useQuery({
        specialCare: "FIRST_RESPONDERS",
        ecmoType: "CARDIAC",
    }).data?.length;
    const singleCareCount1 = react_1.api.patient.getBy.useQuery({
        specialCare: "SINGLE_CARETAKERS",
        ecmoType: "ECPR",
    }).data?.length;
    const singleCareCount2 = react_1.api.patient.getBy.useQuery({
        specialCare: "SINGLE_CARETAKERS",
        ecmoType: "PULMONARY",
    }).data?.length;
    const singleCareCount3 = react_1.api.patient.getBy.useQuery({
        specialCare: "SINGLE_CARETAKERS",
        ecmoType: "CARDIAC",
    }).data?.length;
    const shortTermCount1 = react_1.api.patient.getBy.useQuery({
        specialCare: "SHORT_TERM_SURVIVAL",
        ecmoType: "ECPR",
    }).data?.length;
    const shortTermCount2 = react_1.api.patient.getBy.useQuery({
        specialCare: "SHORT_TERM_SURVIVAL",
        ecmoType: "PULMONARY",
    }).data?.length;
    const shortTermCount3 = react_1.api.patient.getBy.useQuery({
        specialCare: "SHORT_TERM_SURVIVAL",
        ecmoType: "CARDIAC",
    }).data?.length;
    const chartdata = [
        {
            specialCare: "Pediatric",
            ECPR: pediatricCount1,
            Pulmonary: pediatricCount2,
            Cardiac: pediatricCount3,
        },
        {
            specialCare: "Pregnant",
            ECPR: pregnantCount1,
            Pulmonary: pregnantCount2,
            Cardiac: pregnantCount3,
        },
        {
            specialCare: "Responders",
            ECPR: firstResponderCount1,
            Pulmonary: firstResponderCount2,
            Cardiac: firstResponderCount3,
        },
        {
            specialCare: "Caretakers",
            ECPR: singleCareCount1,
            Pulmonary: singleCareCount2,
            Cardiac: singleCareCount3,
        },
        {
            specialCare: "Short Term",
            ECPR: shortTermCount1,
            Pulmonary: shortTermCount2,
            Cardiac: shortTermCount3,
        },
    ];
    return (<react_2.BarChart className="h-72" data={chartdata} index="specialCare" categories={["ECPR", "Pulmonary", "Cardiac"]} colors={["purple-200", "purple-500", "purple-800"]} yAxisWidth={30}/>);
}
