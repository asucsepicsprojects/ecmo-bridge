"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Trash2, AlertCircle, Clock, MapPin } from "lucide-react";
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
    ecmoId: 33946,
    matchedAt: "2024-03-26T14:30:00Z"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    ecmoType: "CARDIAC",
    location: "Banner University Medical Center Tucson",
    distance: 120.3,
    duration: 145,
    ecmoId: 33947,
    matchedAt: "2024-03-26T15:15:00Z"
  },
  {
    id: 3,
    patientName: "Michael Johnson",
    ecmoType: "ECPR",
    location: "Mayo Clinic Hospital - Arizona",
    distance: 8.7,
    duration: 18,
    ecmoId: 33948,
    matchedAt: "2024-03-26T16:00:00Z"
  },
  {
    id: 4,
    patientName: "Sarah Wilson",
    ecmoType: "PULMONARY",
    location: null,
    distance: null,
    duration: null,
    ecmoId: null,
    matchedAt: null
  },
  {
    id: 5,
    patientName: "David Brown",
    ecmoType: "CARDIAC",
    location: "St. Joseph's Hospital and Medical Center",
    distance: 15.2,
    duration: 30,
    ecmoId: 33949,
    matchedAt: "2024-03-26T16:45:00Z"
  }
];

const MatchList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState(mockMatches);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveMatch = (id: number) => {
    setMatches(matches.filter(match => match.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <BarLoader color="#8d33ff" width={250} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Match List</CardTitle>
          <CardDescription>
            Current ECMO matches and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[200px]">Patient Name</TableHead>
                  <TableHead className="w-[150px]">ECMO Type</TableHead>
                  <TableHead className="w-[250px]">Location</TableHead>
                  <TableHead className="w-[150px]">Distance/Duration</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell className="font-medium">{match.patientName}</TableCell>
                    <TableCell>
                      <Badge variant={
                        match.ecmoType === "PULMONARY" ? "default" :
                        match.ecmoType === "CARDIAC" ? "destructive" : "secondary"
                      }>
                        {match.ecmoType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {match.location ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {match.location}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <AlertCircle className="h-4 w-4" />
                          No location available
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {match.distance && match.duration ? (
                        <div className="flex flex-col gap-1">
                          <div className="text-sm">{match.distance} miles</div>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <Clock className="h-3 w-3" />
                            {match.duration} min
                          </div>
                        </div>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={match.ecmoId ? "default" : "destructive"}>
                        {match.ecmoId ? "Matched" : "Unmatched"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRemoveMatch(match.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchList;
