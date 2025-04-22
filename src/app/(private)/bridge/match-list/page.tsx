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
import { Trash2, AlertCircle, Clock, MapPin, Search, Filter, Plus, Building2, CheckCircle2, XCircle, Users, HeartPulse } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import BarLoader from "react-spinners/BarLoader";
import { toast } from "sonner";

// Mock data for matches
const mockMatches = [
  {
    id: 1,
    patientName: "John Smith",
    ecmoType: "VA ECMO",
    location: "Mayo Clinic",
    distance: "0.5 miles",
    duration: "2 hours",
    status: "active",
  },
  {
    id: 2,
    patientName: "Sarah Johnson",
    ecmoType: "VV ECMO",
    location: "St. Mary's Hospital",
    distance: "2.3 miles",
    duration: "1 hour",
    status: "pending",
  },
  {
    id: 3,
    patientName: "Michael Brown",
    ecmoType: "VA ECMO",
    location: "Phoenix General",
    distance: "5.1 miles",
    duration: "3 hours",
    status: "completed",
  },
  {
    id: 4,
    patientName: "Emily Davis",
    ecmoType: "VV ECMO",
    location: "Banner Health",
    distance: "3.7 miles",
    duration: "4 hours",
    status: "cancelled",
  },
  {
    id: 5,
    patientName: "No ECMO Found",
    ecmoType: "N/A",
    location: "N/A",
    distance: "N/A",
    duration: "N/A",
    status: "no-match",
  },
];

// Mock data for available patients
const mockAvailablePatients = [
  {
    id: 101,
    name: "Robert Wilson",
    age: 45,
    condition: "Cardiac Arrest",
    priority: "High",
    waitingTime: "30 min",
    location: "Mayo Clinic",
  },
  {
    id: 102,
    name: "Jennifer Lee",
    age: 32,
    condition: "ARDS",
    priority: "High",
    waitingTime: "45 min",
    location: "Mayo Clinic",
  },
  {
    id: 103,
    name: "David Miller",
    age: 58,
    condition: "Cardiogenic Shock",
    priority: "Medium",
    waitingTime: "1 hour",
    location: "Mayo Clinic",
  },
  {
    id: 104,
    name: "Lisa Chen",
    age: 29,
    condition: "COVID-19",
    priority: "High",
    waitingTime: "15 min",
    location: "Mayo Clinic",
  },
];

// Mock data for available devices
const mockAvailableDevices = [
  {
    id: 201,
    type: "VA ECMO",
    status: "Available",
    location: "Mayo Clinic",
    lastUsed: "2 days ago",
  },
  {
    id: 202,
    type: "VV ECMO",
    status: "Available",
    location: "Mayo Clinic",
    lastUsed: "1 day ago",
  },
  {
    id: 203,
    type: "VA ECMO",
    status: "Available",
    location: "Mayo Clinic",
    lastUsed: "3 days ago",
  },
  {
    id: 204,
    type: "VV ECMO",
    status: "Available",
    location: "Mayo Clinic",
    lastUsed: "4 days ago",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default">Active</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "completed":
      return <Badge variant="outline">Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    case "no-match":
      return <Badge variant="outline">No Match Found</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "no-match":
      return <XCircle className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "High":
      return <Badge variant="destructive">High</Badge>;
    case "Medium":
      return <Badge variant="secondary">Medium</Badge>;
    case "Low":
      return <Badge variant="outline">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

const getDeviceStatusBadge = (status: string) => {
  switch (status) {
    case "Available":
      return <Badge variant="default">Available</Badge>;
    case "In Use":
      return <Badge variant="secondary">In Use</Badge>;
    case "Maintenance":
      return <Badge variant="destructive">Maintenance</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPriorityValue = (priority: string) => {
  switch (priority) {
    case "High":
      return 1;
    case "Medium":
      return 2;
    default:
      return 3;
  }
};

const MatchListPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeMatches, setActiveMatches] = useState(mockMatches);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [filterHospital, setFilterHospital] = useState("ALL");
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [availablePatients, setAvailablePatients] = useState(
    mockAvailablePatients.sort((a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority))
  );
  const [availableDevices, setAvailableDevices] = useState(mockAvailableDevices);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveMatch = (id: number) => {
    setActiveMatches(activeMatches.filter(match => match.id !== id));
  };

  const handleTerminateMatch = (matchId: number) => {
    const match = activeMatches.find(m => m.id === matchId);
    if (match) {
      // Simply remove from active matches
      setActiveMatches(activeMatches.filter(m => m.id !== matchId));
      toast.success(`Terminated match for ${match.patientName}`);
    }
  };

  const filteredMatches = activeMatches.filter(match => {
    const matchesSearch = match.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || match.status === filterStatus;
    const matchesType = filterType === "ALL" || match.ecmoType === filterType;
    const matchesHospital = filterHospital === "ALL" || 
      (filterHospital === "MY_HOSPITAL" && match.isMyHospital) ||
      (filterHospital === "OTHER_HOSPITALS" && !match.isMyHospital);
    return matchesSearch && matchesStatus && matchesType && matchesHospital;
  });

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatient(patientId);
  };

  const handleDeviceSelect = (deviceId: number) => {
    setSelectedDevice(deviceId);
  };

  const handleCreateMatch = () => {
    if (selectedPatient && selectedDevice) {
      const selectedPatientData = availablePatients.find(p => p.id === selectedPatient);
      const selectedDeviceData = availableDevices.find(d => d.id === selectedDevice);

      if (selectedPatientData && selectedDeviceData) {
        // Create new match
        const newMatch = {
          id: activeMatches.length + 1,
          patientName: selectedPatientData.name,
          ecmoType: selectedDeviceData.type,
          location: selectedDeviceData.location,
          distance: "0 miles",
          duration: "0 hours",
          status: "active",
          isMyHospital: true
        };

        // Add to active matches
        setActiveMatches([...activeMatches, newMatch]);

        // Remove selected items from available lists
        setAvailablePatients(availablePatients.filter(p => p.id !== selectedPatient));
        setAvailableDevices(availableDevices.filter(d => d.id !== selectedDevice));
        
        // Reset selections
        setSelectedPatient(null);
        setSelectedDevice(null);

        toast.success(`Created match for ${selectedPatientData.name} with ${selectedDeviceData.type}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <BarLoader color="#8d33ff" width={250} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Match List</h1>
              <p className="text-muted-foreground">Manage and create ECMO patient matches</p>
            </div>
          </div>
        </div>

        {/* Active Matches Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Active Matches</CardTitle>
                <CardDescription>Currently active ECMO patient matches</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search matches..."
                  className="w-[200px]"
                />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>ECMO Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium">
                        {match.patientName}
                      </TableCell>
                      <TableCell>{match.ecmoType}</TableCell>
                      <TableCell>{match.location}</TableCell>
                      <TableCell>{match.distance}</TableCell>
                      <TableCell>{match.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(match.status)}
                          {getStatusBadge(match.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTerminateMatch(match.id)}
                            disabled={match.status !== "active"}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Terminate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create New Match Section */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="text-2xl">Create New Match</CardTitle>
              <CardDescription>Select a patient and available ECMO device to create a new match</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Available Patients Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold ml-4">Available Patients</h3>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search patients..."
                    className="w-[200px]"
                  />
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Waiting Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availablePatients.map((patient) => (
                      <TableRow 
                        key={patient.id}
                        className={selectedPatient === patient.id ? "bg-green-50 hover:bg-green-100" : ""}
                      >
                        <TableCell className="font-medium">
                          {patient.name}
                        </TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.condition}</TableCell>
                        <TableCell>{getPriorityBadge(patient.priority)}</TableCell>
                        <TableCell>{patient.waitingTime}</TableCell>
                        <TableCell>{patient.location}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={selectedPatient === patient.id ? "default" : "outline"} 
                            size="sm"
                            onClick={() => handlePatientSelect(patient.id)}
                          >
                            {selectedPatient === patient.id ? "Selected" : "Select"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Available Devices Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold ml-4">Available Devices</h3>
                <div className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="va">VA ECMO</SelectItem>
                      <SelectItem value="vv">VV ECMO</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="mayo">Mayo Clinic</SelectItem>
                      <SelectItem value="banner">Banner Health</SelectItem>
                      <SelectItem value="stmary">St. Mary's</SelectItem>
                      <SelectItem value="phoenix">Phoenix General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableDevices.map((device) => (
                      <TableRow 
                        key={device.id}
                        className={selectedDevice === device.id ? "bg-green-50 hover:bg-green-100" : ""}
                      >
                        <TableCell className="font-medium">
                          {device.type}
                        </TableCell>
                        <TableCell>{getDeviceStatusBadge(device.status)}</TableCell>
                        <TableCell>{device.location}</TableCell>
                        <TableCell>{device.lastUsed}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={selectedDevice === device.id ? "default" : "outline"} 
                            size="sm"
                            onClick={() => handleDeviceSelect(device.id)}
                          >
                            {selectedDevice === device.id ? "Selected" : "Select"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Create Match Button */}
            <div className="flex justify-end">
              <Button 
                size="lg"
                onClick={handleCreateMatch}
                disabled={!selectedPatient || !selectedDevice}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Match
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MatchListPage;
