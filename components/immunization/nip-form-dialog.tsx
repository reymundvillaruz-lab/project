"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  NIP_VACCINE_LIST,
  NipPatientRecord,
  VaccineEntryForm,
  VaccineStatus,
} from "./types";
import {
  Syringe,
  User,
  Home,
  Activity,
  UserCheck,
  Check,
  AlertCircle,
  Plus,
} from "lucide-react";
import { getStoredPatients, MockPatient } from "@/lib/mock-data/patients";
import { PatientRegistrySelect } from "@/components/patients/patient-registry-select";

interface NipFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialRecord?: NipPatientRecord | null;
  onSave: (record: NipPatientRecord) => void;
}

const emptyVaccines = (): Record<string, VaccineEntryForm> => {
  const map: Record<string, VaccineEntryForm> = {};
  NIP_VACCINE_LIST.forEach((v) => {
    map[v.key] = {
      dateGiven: "",
      nextDue: "",
      status: "",
    };
  });
  return map;
};

const getInitialState = (record?: NipPatientRecord | null): NipPatientRecord => {
  if (record) {
    return {
      ...record,
      vaccines: {
        ...emptyVaccines(),
        ...record.vaccines,
      },
    };
  }

  const today = new Date().toISOString().split("T")[0];
  const initialMap = emptyVaccines();
  // Default first vaccine (BCG) to Completed today as the initial primary selection
  initialMap["bcg"] = {
    dateGiven: today,
    nextDue: "",
    status: "Completed",
  };

  return {
    id: "",
    patientName: "",
    sex: "",
    phicNumber: "",
    birthdate: "",
    age: "",
    nhts: "",
    birthplace: "",
    motherName: "",
    fatherName: "",
    familySerialNo: "",
    address: "",
    dateRegistered: today,
    measurementDate: today,
    heightCm: "",
    weightKg: "",
    temperatureC: "",
    remarks: "",
    vaccines: initialMap,
    providerName: "",
    notes: "",
    createdAt: "",
    updatedAt: "",
  };
};

function calculateAgeFromBirthdate(birthdateStr: string): string {
  if (!birthdateStr) return "";
  const birth = new Date(birthdateStr);
  const now = new Date();
  if (isNaN(birth.getTime())) return "";

  const diffTime = now.getTime() - birth.getTime();
  if (diffTime < 0) return "0 days";

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  }
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 8) {
    return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"}`;
  }
  const diffMonths = Math.floor(diffDays / 30.4375);
  if (diffMonths < 24) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"}`;
  }
  const diffYears = Math.floor(diffDays / 365.25);
  const remainingMonths = Math.floor((diffDays % 365.25) / 30.4375);
  return remainingMonths > 0
    ? `${diffYears}y ${remainingMonths}m`
    : `${diffYears} ${diffYears === 1 ? "year" : "years"}`;
}

export function NipFormDialog({
  open,
  onOpenChange,
  initialRecord,
  onSave,
}: NipFormDialogProps) {
  const [formData, setFormData] = React.useState<NipPatientRecord>(
    getInitialState(initialRecord)
  );
  const [activeTab, setActiveTab] = React.useState("section-personal");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [registeredPatients, setRegisteredPatients] = React.useState<MockPatient[]>([]);
  const [selectedRegistryPatient, setSelectedRegistryPatient] = React.useState<MockPatient | null>(null);

  // Selected primary vaccine key for quick single-dose recording
  const [primaryVaccineKey, setPrimaryVaccineKey] = React.useState("bcg");
  const [showMultiGrid, setShowMultiGrid] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setFormData(getInitialState(initialRecord));
      setActiveTab("section-personal");
      setErrors({});
      setSelectedRegistryPatient(null);
      setRegisteredPatients(getStoredPatients());

      // If initialRecord has a filled vaccine, focus that
      if (initialRecord) {
        const firstFilled = Object.entries(initialRecord.vaccines || {}).find(
          ([, v]) => v.dateGiven || v.nextDue || v.status
        );
        if (firstFilled) {
          setPrimaryVaccineKey(firstFilled[0]);
        }
        setShowMultiGrid(true);
      } else {
        setPrimaryVaccineKey("bcg");
        setShowMultiGrid(false);
      }
    }
  }, [open, initialRecord]);

  const isEdit = Boolean(initialRecord && initialRecord.id);

  // Auto-fill patient from registry
  const handleSelectRegistryPatient = (patientId: string) => {
    if (!patientId) return;
    const match = registeredPatients.find((p) => p.id === patientId);
    if (match) {
      setFormData((prev) => ({
        ...prev,
        patientName: match.fullName || `${match.firstName} ${match.lastName}`,
        sex: match.sex || prev.sex,
        birthdate: match.birthdate || prev.birthdate,
        age: match.age ? `${match.age} yrs` : prev.age,
        phicNumber: match.phicNo || prev.phicNumber,
        address: match.address || prev.address,
      }));
    }
  };

  const handleInputChange = (
    field: keyof NipPatientRecord,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "birthdate" && value) {
        const computedAge = calculateAgeFromBirthdate(value);
        if (computedAge && (!prev.age || prev.age === calculateAgeFromBirthdate(prev.birthdate))) {
          updated.age = computedAge;
        }
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleVaccineChange = (
    key: string,
    field: keyof VaccineEntryForm,
    value: string
  ) => {
    setFormData((prev) => {
      const current = prev.vaccines[key] || { dateGiven: "", nextDue: "", status: "" };
      const updatedEntry: VaccineEntryForm = { ...current, [field]: value };

      if (field === "dateGiven" && value && !updatedEntry.status) {
        updatedEntry.status = "Completed";
      } else if (field === "nextDue" && value && !updatedEntry.status && !updatedEntry.dateGiven) {
        updatedEntry.status = "Scheduled";
      }

      return {
        ...prev,
        vaccines: {
          ...prev.vaccines,
          [key]: updatedEntry,
        },
      };
    });
  };

  const handlePrimaryVaccineKeyChange = (newKey: string) => {
    setPrimaryVaccineKey(newKey);
    const today = new Date().toISOString().split("T")[0];

    // If newKey has no data yet, populate it with today & Completed
    setFormData((prev) => {
      const current = prev.vaccines[newKey];
      if (!current || (!current.dateGiven && !current.status)) {
        return {
          ...prev,
          vaccines: {
            ...prev.vaccines,
            [newKey]: {
              dateGiven: today,
              nextDue: "",
              status: "Completed",
            },
          },
        };
      }
      return prev;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient Name is required.";
    }

    const hasAnyVaccine = Object.values(formData.vaccines).some(
      (v) => v.dateGiven || v.nextDue || v.status
    );

    if (!hasAnyVaccine) {
      newErrors.vaccines = "Please record at least one vaccine dose or schedule.";
    }

    setErrors(newErrors);

    if (newErrors.patientName) {
      setActiveTab("section-personal");
    } else if (newErrors.vaccines) {
      setActiveTab("section-vaccines");
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Filter vaccines to only keep those that have at least one field populated
    const cleanVaccines: Record<string, VaccineEntryForm> = {};
    Object.entries(formData.vaccines).forEach(([k, v]) => {
      if (v.dateGiven || v.nextDue || v.status) {
        cleanVaccines[k] = v;
      }
    });

    const recordToSave: NipPatientRecord = {
      ...formData,
      id: formData.id || `nip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      vaccines: cleanVaccines,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(recordToSave);
    onOpenChange(false);
  };

  const recordedVaccinesCount = Object.values(formData.vaccines).filter(
    (v) => v.dateGiven || v.nextDue || v.status
  ).length;

  const currentPrimaryConfig = NIP_VACCINE_LIST.find((v) => v.key === primaryVaccineKey) || NIP_VACCINE_LIST[0];
  const primaryVaccineEntry = formData.vaccines[primaryVaccineKey] || {
    dateGiven: new Date().toISOString().split("T")[0],
    nextDue: "",
    status: "Completed",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-4xl" className="h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-slate-50/75">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
                <Syringe className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  {isEdit ? "Edit Immunization Record (NIP Form)" : "Record Immunization (NIP Form)"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  National Immunization Program (NIP) Standard Child Health &amp; Immunization Record
                </DialogDescription>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="outline" className="text-slate-600 bg-white border-slate-200">
                {recordedVaccinesCount} Vaccine{recordedVaccinesCount === 1 ? "" : "s"} Selected
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col flex-1 overflow-hidden space-y-0"
          >
            {/* Form Section Navigation */}
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-2">
              <TabsList className="bg-slate-200/70 p-1 w-full justify-start overflow-x-auto h-auto gap-1">
                <TabsTrigger
                  value="section-personal"
                  className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>1. Personal &amp; Family</span>
                  {errors.patientName && (
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="section-address"
                  className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>2. Address &amp; Reg.</span>
                </TabsTrigger>
                <TabsTrigger
                  value="section-measurements"
                  className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span>3. Health Measurements</span>
                </TabsTrigger>
                <TabsTrigger
                  value="section-vaccines"
                  className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Syringe className="h-3.5 w-3.5" />
                  <span className="font-semibold">4. Immunization (Vaccine)</span>
                  {recordedVaccinesCount > 0 && (
                    <span className="ml-1 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.2">
                      {recordedVaccinesCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="section-provider"
                  className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>5. Provider / BHW</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Form Sections Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {/* TAB 1: SECTION 1 (Personal) & SECTION 2 (Family) */}
              <TabsContent value="section-personal" className="m-0 space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        Section 1
                      </span>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Personal Information (Impormasyon ng Pasyente / Bata)
                      </h3>
                    </div>
                  </div>

                  {/* Quick Select from Patient Registry if available */}
                  {!isEdit && (
                    <div className="mb-4">
                      <PatientRegistrySelect
                        selectedPatient={selectedRegistryPatient}
                        onSelectPatient={(match) => {
                          setSelectedRegistryPatient(match);
                          setFormData((prev) => ({
                            ...prev,
                            patientName: match.fullName || `${match.firstName} ${match.lastName}`,
                            sex: match.sex || prev.sex,
                            birthdate: match.birthdate || prev.birthdate,
                            age: match.age ? `${match.age} yrs` : prev.age,
                            phicNumber: match.phicNo || prev.phicNumber,
                            address: match.address || prev.address,
                          }));
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.patientName;
                            return copy;
                          });
                        }}
                        onClearSelection={() => {
                          setSelectedRegistryPatient(null);
                        }}
                        label="Find & Select Registered Resident (Child / Patient)"
                        helperText="Child or patient already filled up in the Patient Registry? Select them to auto-fill personal & address info."
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="patientName" required>
                        Patient / Child Name (Buong Pangalan)
                      </Label>
                      <Input
                        id="patientName"
                        value={formData.patientName}
                        onChange={(e) => handleInputChange("patientName", e.target.value)}
                        placeholder="e.g. Dela Cruz, Juan Santos"
                        className={errors.patientName ? "border-rose-500 focus-visible:ring-rose-500" : ""}
                      />
                      {errors.patientName && (
                        <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.patientName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sex">Sex (Kasarian)</Label>
                      <Select
                        id="sex"
                        value={formData.sex}
                        onChange={(e) => handleInputChange("sex", e.target.value)}
                      >
                        <option value="">Select Sex</option>
                        <option value="Male">Male (Lalaki)</option>
                        <option value="Female">Female (Babae)</option>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="phicNumber">PHIC # (PhilHealth Number)</Label>
                      <Input
                        id="phicNumber"
                        value={formData.phicNumber}
                        onChange={(e) => handleInputChange("phicNumber", e.target.value)}
                        placeholder="e.g. 12-345678901-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="birthdate">Birthdate (Kapanganakan)</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={formData.birthdate}
                        onChange={(e) => handleInputChange("birthdate", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="age">Age (Edad)</Label>
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="e.g. 6 weeks, 2 months"
                      />
                    </div>

                    <div>
                      <Label htmlFor="nhts">NHTS Member (4Ps / NHTS-PR)</Label>
                      <Select
                        id="nhts"
                        value={formData.nhts}
                        onChange={(e) => handleInputChange("nhts", e.target.value)}
                      >
                        <option value="">Select NHTS Status</option>
                        <option value="Yes">Yes (Oo)</option>
                        <option value="No">No (Hindi)</option>
                      </Select>
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="birthplace">Birthplace (Lugar ng Kapanganakan)</Label>
                      <Input
                        id="birthplace"
                        value={formData.birthplace}
                        onChange={(e) => handleInputChange("birthplace", e.target.value)}
                        placeholder="e.g. Barangay Health Station / District Hospital"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      Section 2
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Family Information (Impormasyon ng Pamilya)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="motherName">Mother&apos;s Name (Pangalan ng Ina)</Label>
                      <Input
                        id="motherName"
                        value={formData.motherName}
                        onChange={(e) => handleInputChange("motherName", e.target.value)}
                        placeholder="e.g. Maria Santos Dela Cruz"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fatherName">Father&apos;s Name (Pangalan ng Ama)</Label>
                      <Input
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={(e) => handleInputChange("fatherName", e.target.value)}
                        placeholder="e.g. Pedro Reyes Dela Cruz"
                      />
                    </div>

                    <div>
                      <Label htmlFor="familySerialNo">Family Serial #</Label>
                      <Input
                        id="familySerialNo"
                        value={formData.familySerialNo}
                        onChange={(e) => handleInputChange("familySerialNo", e.target.value)}
                        placeholder="e.g. FSN-2026-081"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: SECTION 3 (Address & Registration) */}
              <TabsContent value="section-address" className="m-0 space-y-6">
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      Section 3
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Address &amp; Registration (Tirahan at Pagpapatala)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Address (Purok / Sitilio / Barangay)</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="e.g. Purok 4, Barangay San Jose"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dateRegistered">Date Registered (Petsa ng Pagkakatala)</Label>
                      <Input
                        id="dateRegistered"
                        type="date"
                        value={formData.dateRegistered}
                        onChange={(e) => handleInputChange("dateRegistered", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: SECTION 4 (Health Measurements) */}
              <TabsContent value="section-measurements" className="m-0 space-y-6">
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      Section 4
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Health Measurements (Sukat at Timbang sa Pagbisita)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="measurementDate">Measurement Date (Petsa)</Label>
                      <Input
                        id="measurementDate"
                        type="date"
                        value={formData.measurementDate}
                        onChange={(e) => handleInputChange("measurementDate", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="heightCm">Height / Length (Haba/Taas sa cm)</Label>
                      <Input
                        id="heightCm"
                        type="number"
                        step="0.1"
                        value={formData.heightCm}
                        onChange={(e) => handleInputChange("heightCm", e.target.value)}
                        placeholder="e.g. 50.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weightKg">Weight (Timbang sa kg)</Label>
                      <Input
                        id="weightKg"
                        type="number"
                        step="0.01"
                        value={formData.weightKg}
                        onChange={(e) => handleInputChange("weightKg", e.target.value)}
                        placeholder="e.g. 3.4"
                      />
                    </div>

                    <div>
                      <Label htmlFor="temperatureC">Temperature (Temperatura °C)</Label>
                      <Input
                        id="temperatureC"
                        type="number"
                        step="0.1"
                        value={formData.temperatureC}
                        onChange={(e) => handleInputChange("temperatureC", e.target.value)}
                        placeholder="e.g. 36.8"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-4">
                      <Label htmlFor="remarks">Health Remarks / Observations</Label>
                      <Textarea
                        id="remarks"
                        rows={3}
                        value={formData.remarks}
                        onChange={(e) => handleInputChange("remarks", e.target.value)}
                        placeholder="e.g. Child is well, alert, feeding well. No adverse reaction observed."
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 4: SECTION 5 (Clean Primary Vaccine Selection + Multi-dose Grid) */}
              <TabsContent value="section-vaccines" className="m-0 space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-2 mb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        Section 5
                      </span>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Vaccine Administration (Pagbabakuna)
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500">
                      DOH National Immunization Program
                    </span>
                  </div>

                  {errors.vaccines && (
                    <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{errors.vaccines}</span>
                    </div>
                  )}

                  {/* Primary Vaccine Selector Card */}
                  <div className="rounded-lg border-2 border-teal-200 bg-teal-50/30 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Syringe className="h-4 w-4 text-teal-700" />
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                          Vaccine Given or Scheduled for this Visit
                        </span>
                      </div>
                      <Badge className="bg-teal-700 text-white font-medium text-[11px]">
                        Target: {currentPrimaryConfig.targetSchedule}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <Label htmlFor="primaryVaccineSelect">
                          Select Vaccine / Antigen <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                          id="primaryVaccineSelect"
                          value={primaryVaccineKey}
                          onChange={(e) => handlePrimaryVaccineKeyChange(e.target.value)}
                          className="h-9 text-xs bg-white font-medium text-slate-900"
                        >
                          {NIP_VACCINE_LIST.map((item) => (
                            <option key={item.key} value={item.key}>
                              {item.vaccineName} &bull; Dose: {item.dose} ({item.targetSchedule})
                            </option>
                          ))}
                        </Select>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {currentPrimaryConfig.description}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="primaryDateGiven">Date Given</Label>
                        <Input
                          id="primaryDateGiven"
                          type="date"
                          value={primaryVaccineEntry.dateGiven}
                          onChange={(e) =>
                            handleVaccineChange(primaryVaccineKey, "dateGiven", e.target.value)
                          }
                          className="h-9 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="primaryStatus">Status <span className="text-rose-500">*</span></Label>
                        <Select
                          id="primaryStatus"
                          value={primaryVaccineEntry.status || "Completed"}
                          onChange={(e) =>
                            handleVaccineChange(
                              primaryVaccineKey,
                              "status",
                              e.target.value as VaccineStatus
                            )
                          }
                          className="h-9 text-xs bg-white font-medium"
                        >
                          <option value="Completed">Completed</option>
                          <option value="Due">Due</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Scheduled">Scheduled</option>
                        </Select>
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="primaryNextDue">Next Due Date (Sunsunod na Petsa)</Label>
                        <Input
                          id="primaryNextDue"
                          type="date"
                          value={primaryVaccineEntry.nextDue}
                          onChange={(e) =>
                            handleVaccineChange(primaryVaccineKey, "nextDue", e.target.value)
                          }
                          className="h-9 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Multi-vaccine toggle */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowMultiGrid(!showMultiGrid)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5"
                    >
                      <span>
                        {showMultiGrid
                          ? "▼ Hide other vaccines from NIP Card"
                          : "► Record additional vaccines given during this visit (e.g. BCG + Hep B at birth)"}
                      </span>
                    </button>
                  </div>

                  {/* Full NIP Card Grid (Optional additional entries) */}
                  {showMultiGrid && (
                    <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-xs mt-3 animate-in fade-in">
                      <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Vaccine</th>
                            <th className="py-2.5 px-2">Dose</th>
                            <th className="py-2.5 px-2">Schedule</th>
                            <th className="py-2.5 px-2 min-w-[130px]">Date Given</th>
                            <th className="py-2.5 px-2 min-w-[130px]">Next Due</th>
                            <th className="py-2.5 px-2 min-w-[120px]">Status</th>
                            <th className="py-2.5 px-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {NIP_VACCINE_LIST.filter((i) => i.key !== primaryVaccineKey).map((item) => {
                            const vEntry = formData.vaccines[item.key] || {
                              dateGiven: "",
                              nextDue: "",
                              status: "",
                            };
                            const isIncluded = Boolean(vEntry.dateGiven || vEntry.status || vEntry.nextDue);

                            return (
                              <tr
                                key={item.key}
                                className={`transition-colors ${
                                  isIncluded ? "bg-teal-50/20" : "hover:bg-slate-50/50"
                                }`}
                              >
                                <td className="py-2 px-3">
                                  <div className="font-semibold text-slate-900">
                                    {item.vaccineName}
                                  </div>
                                </td>
                                <td className="py-2 px-2 font-medium text-slate-700">
                                  <Badge variant="secondary" className="text-[11px] px-1.5 py-0 font-normal">
                                    {item.dose}
                                  </Badge>
                                </td>
                                <td className="py-2 px-2 text-slate-500 whitespace-nowrap">
                                  {item.targetSchedule}
                                </td>
                                <td className="py-2 px-2">
                                  <Input
                                    type="date"
                                    value={vEntry.dateGiven}
                                    onChange={(e) =>
                                      handleVaccineChange(item.key, "dateGiven", e.target.value)
                                    }
                                    className="h-8 text-xs py-1"
                                  />
                                </td>
                                <td className="py-2 px-2">
                                  <Input
                                    type="date"
                                    value={vEntry.nextDue}
                                    onChange={(e) =>
                                      handleVaccineChange(item.key, "nextDue", e.target.value)
                                    }
                                    className="h-8 text-xs py-1"
                                  />
                                </td>
                                <td className="py-2 px-2">
                                  <Select
                                    value={vEntry.status}
                                    onChange={(e) =>
                                      handleVaccineChange(
                                        item.key,
                                        "status",
                                        e.target.value as VaccineStatus
                                      )
                                    }
                                    className="h-8 text-xs py-1"
                                  >
                                    <option value="">-- None --</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Due">Due</option>
                                    <option value="Overdue">Overdue</option>
                                    <option value="Scheduled">Scheduled</option>
                                  </Select>
                                </td>
                                <td className="py-2 px-2 text-right">
                                  {isIncluded ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          vaccines: {
                                            ...prev.vaccines,
                                            [item.key]: { dateGiven: "", nextDue: "", status: "" },
                                          },
                                        }));
                                      }}
                                      className="text-[10px] text-rose-600 hover:underline"
                                    >
                                      Clear
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const today = new Date().toISOString().split("T")[0];
                                        handleVaccineChange(item.key, "dateGiven", today);
                                        handleVaccineChange(item.key, "status", "Completed");
                                      }}
                                      className="text-[10px] text-teal-700 hover:underline font-medium"
                                    >
                                      + Add
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB 5: SECTION 6 (Provider Information) */}
              <TabsContent value="section-provider" className="m-0 space-y-6">
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      Section 6
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Provider Information (Tagapagbakuna / BHW)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="providerName">Provider / BHW (Vaccinator / Health Worker Name)</Label>
                      <Input
                        id="providerName"
                        value={formData.providerName}
                        onChange={(e) => handleInputChange("providerName", e.target.value)}
                        placeholder="e.g. Nurse Joy Ramos, RN / Maria Santos, BHW"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="notes">Notes / Special Instructions (Mga Tala)</Label>
                      <Textarea
                        id="notes"
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="e.g. Advised mother on mild fever management. Paracetamol drops advised if needed."
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              * Required: Patient Name &amp; Vaccine Selection
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-teal-700 hover:bg-teal-800 text-white font-medium"
              >
                <Check className="h-4 w-4 mr-1" />
                {isEdit ? "Update Immunization Record" : "Save Immunization Record"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
