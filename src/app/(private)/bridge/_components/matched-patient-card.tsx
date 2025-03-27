"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// Mock data for matched patients
const mockMatchedPatients = [
  {
    id: 1,
    name: "John Doe",
    ecmoType: "PULMONARY",
    specialCare: "PEDIATRIC",
    age: 8
  },
  {
    id: 2,
    name: "Jane Smith",
    ecmoType: "CARDIAC",
    specialCare: "FIRST_RESPONDERS",
    age: 34
  },
  {
    id: 3,
    name: "Michael Johnson",
    ecmoType: "ECPR",
    specialCare: "SINGLE_CARETAKERS",
    age: 45
  },
  {
    id: 4,
    name: "Sarah Wilson",
    ecmoType: "PULMONARY",
    specialCare: "PREGNANT_PATIENTS",
    age: 28
  },
  {
    id: 5,
    name: "David Brown",
    ecmoType: "CARDIAC",
    specialCare: "SHORT_TERM_SURVIVAL",
    age: 62
  }
];

export function MatchedPatients() {
  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Matched Patients</CardTitle>
          <CardDescription>Recent patients from your hospital.</CardDescription>
        </div>
        <Button
          asChild
          size="sm"
          className="ml-auto gap-1 bg-primary-purple-900"
        >
          <Link href="/bridge/match-list">
            Match List
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-8 px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="xl:table-column">Type</TableHead>
              <TableHead className="xl:table-column">Special Care</TableHead>
              <TableHead className="xl:table-column">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMatchedPatients.map((patient) => {
              return (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="font-medium">{patient.name}</div>
                  </TableCell>
                  <TableCell className="xl:table-column">
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {patient.ecmoType
                        .toString()
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </div>
                  </TableCell>
                  <TableCell className="xl:table-column">
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {patient.specialCare
                        .toString()
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </div>
                  </TableCell>
                  <TableCell className="text-left">{patient.age}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
