import React from "react";
import { ECMOForm } from "../_components/ecmo-form";
import { api } from "~/trpc/server";
import { ECMO, ECMOColumns } from "./columns";
import { ECMODataTable } from "./data-table";
import { PatientColumns } from "../patients/columns";
import { PatientDataTable } from "../patients/data-table";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Map from "./map"

// Mock data for patients reflecting the updated structure
const mockPatients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    specialCare: "FIRST_RESPONDERS",  // New field added
    ecmoType: "PULMONARY",  // New field added
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 34,
    specialCare: "PREGNANT_PATIENTS",  // New field added
    ecmoType: "CARDIAC",  // New field added
  },
  {
    id: 3,
    name: "Michael Johnson",
    age: 60,
    specialCare: "SINGLE_CARETAKERS",  // New field added
    ecmoType: "ECPR",  // New field added
  },
];

const ecmoList: ECMO[] = [
  { 
    id: 33946,
    model: "ECMO Model A", 
    serial: "123-456-789", 
    type: "PULMONARY", 
    inUse: true, 
    lat: 33.478909, 
    lng: -112.041576, 
    hospital: "Phoenix Children's Hospital" 
  },
  { 
    id: 33946,
    model: "ECMO Model B", 
    serial: "987-654-321", 
    type: "CARDIAC", 
    inUse: false, 
    lat: 32.2429,
    lng: -110.9462, 
    hospital: "Banner University Medical Center Tucson" 
  },
  { 
    id: 33946,
    model: "ECMO Model A", 
    serial: "789-123-456", 
    type: "CARDIAC", 
    inUse: false, 
    lat: 33.4646,
    lng: -112.0574, 
    hospital: "Banner University Medical Center - Phoenix" 
  },
  { 
    id: 33946,
    model: "ECMO Model C", 
    serial: "111-222-333", 
    type: "PULMONARY", 
    inUse: true, 
    lat: 33.297212,
    lng: -111.874652,
    hospital: "Chandler Regional Medical Center" 
  },
  { 
    id: 33946,
    model: "ECMO Model B", 
    serial: "444-555-666", 
    type: "CARDIAC", 
    inUse: false, 
    lat: 33.56926640543833,
    lng: -112.07087037705375,
    hospital: "HonorHealth John C Lincoln Medical Center" 
  },
  { 
    id: 33946,
    model: "ECMO Model C", 
    serial: "777-888-999", 
    type: "PULMONARY", 
    inUse: true, 
    lat: 33.6594, 
    lng: -111.9563, 
    hospital: "Mayo Clinic Hospital - Arizona" 
  },
  { 
    id: 33946,
    model: "ECMO Model A", 
    serial: "000-111-222", 
    type: "CARDIAC", 
    inUse: false, 
    lat: 33.4820, 
    lng: -112.0791, 
    hospital: "St. Joseph's Hospital and Medical Center" 
  },
  { 
    id: 33946,
    model: "ECMO Model B", 
    serial: "333-444-555", 
    type: "PULMONARY", 
    inUse: true, 
    lat: 33.57795841671927,
    lng: -111.88321908881879,
    hospital: "HonorHealth Scottsdale Shea Medical Center" 
  },
];


const MachinesPage = async () => {
  try {
    const patients = mockPatients

    //const ecmos = await api.ecmo.get();
    //const patients = await api.patient.get();

    return (
        <div className="flex h-screen flex-row">
            <PatientDataTable data={patients} columns={PatientColumns} />
            {/*  <ECMODataTable data={ecmos} columns={ECMOColumns} /> --> */}
            <Map ecmoList={ecmoList}/>                                                  {/* ADD ECMO DATA AS ARGUMENT TO MAP*/}
        </div>
    );
  } catch (e) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <h1>You cannot access this yet.</h1>
        <Button asChild size="sm" className="gap-1 bg-primary-purple-900">
          <Link href="/bridge/settings">
            Settings
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }
};

export default MachinesPage;
