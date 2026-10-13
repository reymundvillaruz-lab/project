"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  X,
  User,
  Calendar,
  Activity,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MockConsultation,
  PatientOption,
  MOCK_PROVIDERS,
  MOCK_VISIT_TYPES,
  VisitType,
  getConsultationById,
  addStoredConsultation,
  updateStoredConsultation,
  getStoredConsultations,
} from "@/lib/mock-data/consultations";
import { getStoredPatients, saveStoredPatients, MockPatient } from "@/lib/mock-data/patients";

export function ConsultationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const paramPatientId = searchParams.get("patientId");

  // Dynamic registered patients list
  const [registeredPatients, setRegisteredPatients] = React.useState<MockPatient[]>([]);

  // Patient search state for selection
  const [patientSearchTerm, setPatientSearchTerm] = React.useState("");
  const [selectedPatient, setSelectedPatient] = React.useState<PatientOption | null>(null);

  // Form Fields State
  const [consultationDate, setConsultationDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [visitType, setVisitType] = React.useState<VisitType>("General Consultation");
  const [provider, setProvider] = React.useState<string>(MOCK_PROVIDERS[0]);

  // Vital Signs
  const [temperature, setTemperature] = React.useState("");
  const [bpSystolic, setBpSystolic] = React.useState("");
  const [bpDiastolic, setBpDiastolic] = React.useState("");
  const [pulseRate, setPulseRate] = React.useState("");
  const [respiratoryRate, setRespiratoryRate] = React.useState("");
  const [weightKg, setWeightKg] = React.useState("");
  const [heightCm, setHeightCm] = React.useState("");
  const [bmi, setBmi] = React.useState("");

  // Complaint, Assessment, Notes
  const [reasonForVisit, setReasonForVisit] = React.useState("");
  const [diagnosis, setDiagnosis] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Follow-up
  const [followUpRequired, setFollowUpRequired] = React.useState<"No" | "Yes">("No");
  const [followUpDate, setFollowUpDate] = React.useState("");
  const [followUpInstructions, setFollowUpInstructions] = React.useState("");

  // Feedback & Validation States
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [showToast, setShowToast] = React.useState(false);

  // Load registered patients on client mount
  React.useEffect(() => {
    const list = getStoredPatients();
    setRegisteredPatients(list);

    // If paramPatientId is provided, select patient automatically
    if (paramPatientId && !editId) {
      const match = list.find((p) => p.id.toLowerCase() === paramPatientId.toLowerCase());
      if (match) {
        setSelectedPatient({
          id: match.id,
          name: match.fullName || `${match.firstName} ${match.lastName}`,
          age: match.age,
          sex: match.sex,
          contact: match.contact || match.phicNo || "",
        });
      }
    }
  }, [paramPatientId, editId]);

  // Auto-calculate BMI
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWeightKg(val);
    calculateBmi(val, heightCm);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeightCm(val);
    calculateBmi(weightKg, val);
  };

  const calculateBmi = (wStr: string, hStr: string) => {
    const w = parseFloat(wStr);
    const h = parseFloat(hStr);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      const heightInMeters = h / 100;
      const res = (w / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(res);
    } else {
      setBmi("");
    }
  };

  // Populate form if in edit mode
  React.useEffect(() => {
    if (editId) {
      const existing = getConsultationById(editId);
      if (existing) {
        setSelectedPatient({
          id: existing.patientId,
          name: existing.patientName,
          age: existing.patientAge,
          sex: existing.patientSex,
          contact: existing.patientContact,
        });

        // Parse date if needed
        const dateParsed = new Date(existing.date);
        if (!isNaN(dateParsed.getTime())) {
          setConsultationDate(dateParsed.toISOString().split("T")[0]);
        }

        setVisitType(existing.visitType);
        setProvider(existing.provider);

        // Vitals
        setTemperature(existing.vitalSigns.temperature || "");
        setBpSystolic(existing.vitalSigns.bloodPressureSystolic || "");
        setBpDiastolic(existing.vitalSigns.bloodPressureDiastolic || "");
        setPulseRate(existing.vitalSigns.pulseRate || "");
        setRespiratoryRate(existing.vitalSigns.respiratoryRate || "");
        setWeightKg(existing.vitalSigns.weightKg || "");
        setHeightCm(existing.vitalSigns.heightCm || "");
        setBmi(existing.vitalSigns.bmi || "");

        // Texts
        setReasonForVisit(existing.reasonForVisit);
        setDiagnosis(existing.diagnosis);
        setNotes(existing.notes);

        // Follow-up
        setFollowUpRequired(existing.followUp.required);
        if (existing.followUp.date) {
          setFollowUpDate(existing.followUp.date);
        }
        if (existing.followUp.instructions) {
          setFollowUpInstructions(existing.followUp.instructions);
        }
      }
    }
  }, [editId]);

  // Map registered patients into PatientOption format
  const patientOptions: PatientOption[] = React.useMemo(() => {
    return registeredPatients.map((p) => ({
      id: p.id,
      name: p.fullName || `${p.firstName} ${p.lastName}`,
      age: p.age,
      sex: p.sex,
      contact: p.contact || p.phicNo || "",
    }));
  }, [registeredPatients]);

  // Filter patients for search dropdown
  const filteredPatientOptions = React.useMemo(() => {
    if (!patientSearchTerm.trim()) {
      return patientOptions;
    }
    const q = patientSearchTerm.toLowerCase().trim();
    return patientOptions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.contact.toLowerCase().includes(q)
    );
  }, [patientOptions, patientSearchTerm]);

  const handlePatientSelect = (p: PatientOption) => {
    setSelectedPatient(p);
    setPatientSearchTerm("");
    setValidationError(null);
  };

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) {
      setSelectedPatient(null);
      return;
    }
    const found = patientOptions.find((p) => p.id === id);
    if (found) {
      handlePatientSelect(found);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!selectedPatient) {
      setValidationError("Please select a patient for this consultation.");
      return;
    }
    if (!consultationDate) {
      setValidationError("Please specify the consultation date.");
      return;
    }
    if (!provider) {
      setValidationError("Please select the attending BHW or Provider.");
      return;
    }
    if (!reasonForVisit.trim()) {
      setValidationError("Please provide the reason for visit / chief complaint.");
      return;
    }

    // Generate Consultation ID or use existing
    let consultationId = editId;
    if (!consultationId) {
      const allConsultations = getStoredConsultations();
      const nextNum = allConsultations.length + 1;
      consultationId = `C-${String(nextNum).padStart(4, "0")}`;
    }

    // Format date string
    const d = new Date(consultationDate);
    const formattedDate = !isNaN(d.getTime())
      ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : consultationDate;

    const newRecord: MockConsultation = {
      id: consultationId,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAge: selectedPatient.age,
      patientSex: selectedPatient.sex,
      patientContact: selectedPatient.contact,
      date: formattedDate,
      visitType: visitType,
      provider: provider,
      reasonForVisit: reasonForVisit.trim(),
      diagnosis: diagnosis.trim() || "Clinical consultation completed",
      vitalSigns: {
        temperature: temperature.trim(),
        bloodPressureSystolic: bpSystolic.trim(),
        bloodPressureDiastolic: bpDiastolic.trim(),
        pulseRate: pulseRate.trim(),
        respiratoryRate: respiratoryRate.trim(),
        weightKg: weightKg.trim(),
        heightCm: heightCm.trim(),
        bmi: bmi.trim(),
      },
      notes: notes.trim(),
      followUp: {
        required: followUpRequired,
        date: followUpRequired === "Yes" ? followUpDate : undefined,
        instructions: followUpRequired === "Yes" ? followUpInstructions.trim() : undefined,
      },
      status: followUpRequired === "Yes" ? "Follow-up" : "Completed",
    };

    if (editId) {
      updateStoredConsultation(newRecord);
    } else {
      addStoredConsultation(newRecord);
    }

    // Also update patient's consultations history in patient registry
    const allPatients = getStoredPatients();
    const patientIndex = allPatients.findIndex((p) => p.id === selectedPatient.id);
    if (patientIndex >= 0) {
      const targetPatient = allPatients[patientIndex];
      const existingConsultationIndex = targetPatient.consultations.findIndex(
        (c) => c.id === consultationId
      );
      const consultationSummary = {
        id: consultationId,
        date: formattedDate,
        purpose: reasonForVisit.trim(),
        physician: provider,
        diagnosis: diagnosis.trim() || "Clinical consultation completed",
      };

      if (existingConsultationIndex >= 0) {
        targetPatient.consultations[existingConsultationIndex] = consultationSummary;
      } else {
        targetPatient.consultations = [consultationSummary, ...targetPatient.consultations];
      }
      targetPatient.lastVisit = consultationDate;
      saveStoredPatients(allPatients);
    }

    setShowToast(true);
  };

  const handleToastClose = () => {
    setShowToast(false);
    router.push("/consultations");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/consultations">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label="Back to consultations">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {editId ? `Edit Consultation ${editId}` : "New Consultation"}
            </h1>
            <p className="text-xs text-slate-500">
              Record patient visit, clinical vitals, chief complaint, and assessment plan.
            </p>
          </div>
        </div>

        <Link href="/consultations">
          <Button variant="outline" size="sm" className="text-xs">
            <X className="h-3.5 w-3.5 mr-1" />
            Cancel
          </Button>
        </Link>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div
          role="alert"
          className="rounded-lg border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-900 flex items-center gap-2.5 animate-in fade-in-50"
        >
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. PATIENT SECTION */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-teal-700" />
                <CardTitle className="text-sm font-semibold">1. Patient Selection</CardTitle>
              </div>
              <Link href="/patients/new">
                <Button size="sm" variant="outline" className="text-xs h-7">
                  <UserPlus className="h-3 w-3 mr-1" />
                  + Register New Patient
                </Button>
              </Link>
            </div>
            <CardDescription>
              Select a registered barangay patient or search by name and patient ID
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-4">
            {/* If no patients in registry at all */}
            {patientOptions.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    No patients have been registered yet. Please register a patient before starting a consultation.
                  </span>
                </div>
                <Link href="/patients/new">
                  <Button size="sm" className="bg-amber-700 hover:bg-amber-800 text-white text-xs shrink-0">
                    Register Patient Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Always-visible Search Bar for Patient Selection */}
                <div>
                  <label htmlFor="patientSearch" className="block text-xs font-semibold text-slate-700 mb-1">
                    Search Patient (by Name, ID, or Contact) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="patientSearch"
                      type="text"
                      value={patientSearchTerm}
                      onChange={(e) => setPatientSearchTerm(e.target.value)}
                      placeholder="Type patient name, ID, or contact number to find patient..."
                      className="pl-9 text-xs h-9 bg-white"
                      autoComplete="off"
                    />
                    {patientSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setPatientSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Filter suggestions dropdown */}
                  {patientSearchTerm.trim() && (
                    <div className="mt-1 max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg text-xs divide-y divide-slate-100 z-30">
                      {filteredPatientOptions.length === 0 ? (
                        <div className="p-3 text-slate-400 text-center">
                          No matching patients found for &quot;{patientSearchTerm}&quot;
                        </div>
                      ) : (
                        filteredPatientOptions.map((p) => (
                          <button
                            type="button"
                            key={p.id}
                            onClick={() => handlePatientSelect(p)}
                            className="w-full text-left p-2.5 hover:bg-teal-50 flex items-center justify-between rounded transition-colors group"
                          >
                            <div>
                              <span className="font-semibold text-slate-900 group-hover:text-teal-900">
                                {p.name}
                              </span>
                              <span className="text-slate-500 text-[11px] ml-2">
                                {p.age} yrs old &bull; {p.sex} &bull; {p.contact || "No contact"}
                              </span>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-teal-100 text-teal-800">
                              Select: {p.id}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Direct Patient Dropdown as convenient alternate */}
                <div>
                  <label htmlFor="patientSelectDropdown" className="block text-[11px] font-medium text-slate-500 mb-1">
                    Or select directly from list ({patientOptions.length} registered):
                  </label>
                  <Select
                    id="patientSelectDropdown"
                    value={selectedPatient?.id || ""}
                    onChange={handleDropdownSelect}
                    className="text-xs h-8 bg-slate-50/50"
                  >
                    <option value="">
                      -- Choose a registered patient ({patientOptions.length} available) --
                    </option>
                    {patientOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id}) &bull; {p.age}y {p.sex}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}

            {/* Selected Patient Details Card */}
            {selectedPatient ? (
              <div className="rounded-lg border border-teal-200 bg-teal-50/50 p-4 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-teal-950">{selectedPatient.name}</span>
                    <Badge variant="success" className="text-[10px]">
                      Selected Patient
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                      {selectedPatient.id}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPatient(null)}
                      className="h-6 text-[11px] text-slate-500 hover:text-rose-600 px-1.5"
                    >
                      Change
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Age</span>
                    <span className="font-medium">{selectedPatient.age} years old</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Sex</span>
                    <span className="font-medium">{selectedPatient.sex}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact</span>
                    <span className="font-mono font-medium">{selectedPatient.contact || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Registry Status</span>
                    <span className="text-emerald-700 font-semibold">Active Resident</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
                No patient selected yet. Select a patient above to start recording the consultation.
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. VISIT INFORMATION */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-700" />
              <CardTitle className="text-sm font-semibold">2. Visit Information</CardTitle>
            </div>
            <CardDescription>Date of visit, classification, and attending health personnel</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="consultationDate" className="block text-xs font-semibold text-slate-700 mb-1">
                  Consultation Date <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="consultationDate"
                  type="date"
                  value={consultationDate}
                  onChange={(e) => setConsultationDate(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label htmlFor="visitType" className="block text-xs font-semibold text-slate-700 mb-1">
                  Visit Type <span className="text-rose-500">*</span>
                </label>
                <Select
                  id="visitType"
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value as VisitType)}
                  className="text-xs"
                  required
                >
                  {MOCK_VISIT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label htmlFor="provider" className="block text-xs font-semibold text-slate-700 mb-1">
                  Attending Staff / Provider <span className="text-rose-500">*</span>
                </label>
                <Select
                  id="provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="text-xs"
                  required
                >
                  {MOCK_PROVIDERS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. VITAL SIGNS */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-700" />
              <CardTitle className="text-sm font-semibold">3. Vital Signs &amp; Anthropometrics</CardTitle>
            </div>
            <CardDescription>Record objective baseline vitals and measurements</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label htmlFor="temperature" className="block text-xs font-semibold text-slate-700 mb-1">
                  Temperature (°C)
                </label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 36.8"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="bpSystolic" className="block text-xs font-semibold text-slate-700 mb-1">
                  BP Systolic (mmHg)
                </label>
                <Input
                  id="bpSystolic"
                  type="number"
                  placeholder="e.g. 120"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="bpDiastolic" className="block text-xs font-semibold text-slate-700 mb-1">
                  BP Diastolic (mmHg)
                </label>
                <Input
                  id="bpDiastolic"
                  type="number"
                  placeholder="e.g. 80"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="pulseRate" className="block text-xs font-semibold text-slate-700 mb-1">
                  Pulse Rate (bpm)
                </label>
                <Input
                  id="pulseRate"
                  type="number"
                  placeholder="e.g. 78"
                  value={pulseRate}
                  onChange={(e) => setPulseRate(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="respiratoryRate" className="block text-xs font-semibold text-slate-700 mb-1">
                  Resp. Rate (cpm)
                </label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  placeholder="e.g. 18"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="weightKg" className="block text-xs font-semibold text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 62.5"
                  value={weightKg}
                  onChange={handleWeightChange}
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="heightCm" className="block text-xs font-semibold text-slate-700 mb-1">
                  Height (cm)
                </label>
                <Input
                  id="heightCm"
                  type="number"
                  step="0.5"
                  placeholder="e.g. 165"
                  value={heightCm}
                  onChange={handleHeightChange}
                  className="text-xs"
                />
              </div>

              <div>
                <label htmlFor="bmi" className="block text-xs font-semibold text-slate-700 mb-1">
                  BMI (kg/m²)
                </label>
                <Input
                  id="bmi"
                  type="text"
                  placeholder="Auto-calculated"
                  value={bmi}
                  readOnly
                  className="text-xs bg-slate-50 cursor-not-allowed font-mono font-medium text-slate-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. CHIEF COMPLAINT & CLINICAL NOTES */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-700" />
              <CardTitle className="text-sm font-semibold">4. Assessment &amp; Clinical Notes</CardTitle>
            </div>
            <CardDescription>Patient symptoms, primary clinical findings, and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div>
              <label htmlFor="reasonForVisit" className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Visit / Chief Complaint <span className="text-rose-500">*</span>
              </label>
              <Input
                id="reasonForVisit"
                type="text"
                placeholder="e.g. Routine hypertension checkup, persistent cough for 3 days, headache"
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div>
              <label htmlFor="diagnosis" className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Impression / Diagnosis
              </label>
              <Input
                id="diagnosis"
                type="text"
                placeholder="e.g. Essential Hypertension - Controlled, Acute Upper Respiratory Infection"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-semibold text-slate-700 mb-1">
                Subjective Notes / Care Plan
              </label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Clinical observations, medication instructions, and general health advice provided..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* 5. FOLLOW-UP SCHEDULE */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-teal-700" />
              <CardTitle className="text-sm font-semibold">5. Follow-up &amp; Disposition</CardTitle>
            </div>
            <CardDescription>Determine if repeat consultation or clinic visit is scheduled</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="followUpRequired" className="block text-xs font-semibold text-slate-700 mb-1">
                  Follow-up Required?
                </label>
                <Select
                  id="followUpRequired"
                  value={followUpRequired}
                  onChange={(e) => setFollowUpRequired(e.target.value as "No" | "Yes")}
                  className="text-xs"
                >
                  <option value="No">No - Issue Resolved / As-needed</option>
                  <option value="Yes">Yes - Schedule Return Visit</option>
                </Select>
              </div>

              {followUpRequired === "Yes" && (
                <div>
                  <label htmlFor="followUpDate" className="block text-xs font-semibold text-slate-700 mb-1">
                    Return Date
                  </label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="text-xs"
                  />
                </div>
              )}
            </div>

            {followUpRequired === "Yes" && (
              <div>
                <label htmlFor="followUpInstructions" className="block text-xs font-semibold text-slate-700 mb-1">
                  Follow-up Instructions
                </label>
                <Input
                  id="followUpInstructions"
                  type="text"
                  placeholder="e.g. Return if fever persists beyond 3 days, bring BP monitoring log"
                  value={followUpInstructions}
                  onChange={(e) => setFollowUpInstructions(e.target.value)}
                  className="text-xs"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/consultations">
            <Button type="button" variant="outline" size="sm" className="text-xs">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="sm" className="bg-teal-700 hover:bg-teal-800 text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {editId ? "Update Consultation" : "Save Consultation"}
          </Button>
        </div>
      </form>

      {/* Success Notification Modal */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl text-center space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editId ? "Consultation Updated" : "Consultation Recorded"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Patient visit details have been successfully saved to the consultation records.
              </p>
            </div>
            <Button onClick={handleToastClose} className="w-full bg-teal-700 hover:bg-teal-800 text-xs">
              Continue to Consultations
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
