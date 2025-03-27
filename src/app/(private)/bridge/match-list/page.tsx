"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import CountUp from "react-countup";
import BarLoader from "react-spinners/BarLoader";

// Mock data for matches
const mockMatches = [
  {
    id: 1,
    patientName: "John Doe",
    ecmoType: "PULMONARY",
    location: "Phoenix Children's Hospital",
    distance: 12.5,
    duration: 25,
    ecmoId: 33946
  },
  {
    id: 2,
    patientName: "Jane Smith",
    ecmoType: "CARDIAC",
    location: "Banner University Medical Center Tucson",
    distance: 120.3,
    duration: 145,
    ecmoId: 33947
  },
  {
    id: 3,
    patientName: "Michael Johnson",
    ecmoType: "ECPR",
    location: "Mayo Clinic Hospital - Arizona",
    distance: 8.7,
    duration: 18,
    ecmoId: 33948
  },
  {
    id: 4,
    patientName: "Sarah Wilson",
    ecmoType: "PULMONARY",
    location: null,
    distance: null,
    duration: null,
    ecmoId: null
  },
  {
    id: 5,
    patientName: "David Brown",
    ecmoType: "CARDIAC",
    location: "St. Joseph's Hospital and Medical Center",
    distance: 15.2,
    duration: 30,
    ecmoId: 33949
  }
];

const MatchList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second loading time

    return () => clearTimeout(timer);
  }, []);

  // Reset count up completion state on new loading
  useEffect(() => {
    if (isLoading) {
      setIsComplete(false);
    }
  }, [isLoading]);

  if (isLoading && !isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <BarLoader color="#8d33ff" width={250} />
      </div>
    );
  }

  return (
    <div className="p-10">
      <Table>
        <TableCaption>
          A list of matched ECMO machines to patients.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Patient Name</TableHead>
            <TableHead className="w-1/3">ECMO Type</TableHead>
            <TableHead className="w-1/3 text-right">Machine Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockMatches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>{match.patientName}</TableCell>
              <TableCell>
                {match.ecmoId === null
                  ? "No ECMO found for this patient"
                  : match.ecmoType}
              </TableCell>
              <TableCell className="text-right">
                {match.location === null &&
                match.distance === null &&
                match.duration === null ? (
                  "Match not found"
                ) : (
                  <>
                    {match.location}
                    <br />
                    Distance:{" "}
                    {match.distance ? `${match.distance} miles` : "N/A"}
                    <br />
                    Duration:{" "}
                    {match.duration ? `${match.duration} minutes` : "N/A"}
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchList;
