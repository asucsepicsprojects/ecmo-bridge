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
import { Trash2, AlertCircle, Clock, MapPin, Search, Filter, Plus, Building2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
    matchedAt: "2024-03-26T14:30:00Z",
    status: "ACTIVE",
    isMyHospital: true
  },
  {
    id: 2,
    patientName: "Jane Smith",
    ecmoType: "CARDIAC",
    location: "Banner University Medical Center Tucson",
    distance: 120.3,
    duration: 145,
    ecmoId: 33947,
    matchedAt: "2024-03-26T15:15:00Z",
    status: "ACTIVE",
    isMyHospital: false
  },
  {
    id: 3,
    patientName: "Michael Johnson",
    ecmoType: "ECPR",
    location: "Mayo Clinic Hospital - Arizona",
    distance: 8.7,
    duration: 18,
    ecmoId: 33948,
    matchedAt: "2024-03-26T16:00:00Z",
    status: "PENDING",
    isMyHospital: false
  },
  {
    id: 4,
    patientName: "Sarah Wilson",
    ecmoType: "PULMONARY",
    location: null,
    distance: null,
    duration: null,
    ecmoId: null,
    matchedAt: null,
    status: "UNMATCHED",
    isMyHospital: true
  },
  {
    id: 5,
    patientName: "David Brown",
    ecmoType: "CARDIAC",
    location: "St. Joseph's Hospital and Medical Center",
    distance: 15.2,
    duration: 30,
    ecmoId: 33949,
    matchedAt: "2024-03-26T16:45:00Z",
    status: "ACTIVE",
    isMyHospital: false
  }
];

const MatchList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState(mockMatches);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [filterHospital, setFilterHospital] = useState("ALL");

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

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || match.status === filterStatus;
    const matchesType = filterType === "ALL" || match.ecmoType === filterType;
    const matchesHospital = filterHospital === "ALL" || 
      (filterHospital === "MY_HOSPITAL" && match.isMyHospital) ||
      (filterHospital === "OTHER_HOSPITALS" && !match.isMyHospital);
    return matchesSearch && matchesStatus && matchesType && matchesHospital;
  });

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Match List</CardTitle>
              <CardDescription>
                Current ECMO matches and their status
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Match
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="UNMATCHED">Unmatched</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="PULMONARY">Pulmonary</SelectItem>
                    <SelectItem value="CARDIAC">Cardiac</SelectItem>
                    <SelectItem value="ECPR">ECPR</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterHospital} onValueChange={setFilterHospital}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Hospitals</SelectItem>
                    <SelectItem value="MY_HOSPITAL">My Hospital</SelectItem>
                    <SelectItem value="OTHER_HOSPITALS">Other Hospitals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                  {filteredMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium">{match.patientName}</TableCell>
                      <TableCell>
                        {match.ecmoType}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {match.isMyHospital && (
                            <Badge variant="outline" className="mr-1">
                              <Building2 className="mr-1 h-3 w-3" />
                              My Hospital
                            </Badge>
                          )}
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
                        </div>
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
                        <Badge variant={
                          match.status === "ACTIVE" ? "default" :
                          match.status === "PENDING" ? "secondary" : "destructive"
                        }>
                          {match.status}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchList;
