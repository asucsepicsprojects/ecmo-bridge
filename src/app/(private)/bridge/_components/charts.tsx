"use client";
import { BarChart } from "@tremor/react";
import React from "react";

// Mock data for the chart
const mockChartData = [
  {
    specialCare: "Pediatric",
    ECPR: 2,
    Pulmonary: 3,
    Cardiac: 1,
  },
  {
    specialCare: "Pregnant",
    ECPR: 1,
    Pulmonary: 2,
    Cardiac: 1,
  },
  {
    specialCare: "Responders",
    ECPR: 3,
    Pulmonary: 2,
    Cardiac: 2,
  },
  {
    specialCare: "Caretakers",
    ECPR: 1,
    Pulmonary: 2,
    Cardiac: 1,
  },
  {
    specialCare: "Short Term",
    ECPR: 2,
    Pulmonary: 1,
    Cardiac: 1,
  },
];

export function PatientChart() {
  return (
    <BarChart
      className="h-72"
      data={mockChartData}
      index="specialCare"
      categories={["ECPR", "Pulmonary", "Cardiac"]}
      colors={["purple-200", "purple-500", "purple-800"]}
      yAxisWidth={30}
    />
  );
}
