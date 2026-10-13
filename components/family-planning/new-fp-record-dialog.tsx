import * as React from "react";
import {
  FileText,
  User,
  HeartHandshake,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  Building,
  AlertCircle,
  Users,
} from "lucide-react";
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
import {
  FPClient,
  FPClientType,
  FPMethod,
  FPClientStatus,
  FPMedicalHistory,
  FPObGynHistory,
  FPSTIRiskAssessment,
  FPVAWAssessment,
  FPPhysicalExam,
} from "@/types/family-planning";
import { getTodayDateString } from "@/lib/family-planning-utils";

interface NewFPRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: FPClient) => void;
  initialData?: FPClient | null;
}

const DEFAULT_MEDICAL_HISTORY: FPMedicalHistory = {
  severeHeadache: false,
  historyOfStrokeHeartAttack: false,
  hypertension: false,
  coagulationDisorder: false,
  breastCancerLump: false,
  severeChestPain: false,
  unexplainedVaginalBleeding: false,
  vaginalDischargeInfection: false,
  jaundiceLiverDisease: false,
  smokingHabit: false,
  takingAntiSeizureOrAntiTB: false,
  otherMedicalConditions: "",
};

const DEFAULT_OB_GYN_HISTORY: FPObGynHistory = {
  gravida: 0,
  para: 0,
  fullTerm: 0,
  premature: 0,
  abortion: 0,
  livingChildren: 0,
  dateOfLastDelivery: "",
  typeOfLastDelivery: "None / N/A",
  lmp: "",
  pmp: "",
  menstrualFlow: "Moderate",
  dysmenorrhea: false,
  hydatidiformMoleHistory: false,
  ectopicPregnancyHistory: false,
};

const DEFAULT_STI_ASSESSMENT: FPSTIRiskAssessment = {
  abnormalVaginalDischarge: false,
  genitalSoresUlcers: false,
  painBurningUrination: false,
  historyTreatedSTI: false,
  partnerWithSTISymptoms: false,
  multipleSexualPartners: false,
};

const DEFAULT_VAW_ASSESSMENT: FPVAWAssessment = {
  unpleasantRelationship: false,
  partnerDisapprovesFP: false,
  domesticViolenceHistory: false,
  referredToVAWDesk: false,
};

const DEFAULT_PHYSICAL_EXAM: FPPhysicalExam = {
  weightKg: undefined,
  heightCm: undefined,
  bloodPressure: "",
  pulseRate: undefined,
  conjunctiva: "Normal",
  neckThyroid: "Normal",
  breast: "Normal",
  abdomen: "Normal",
  extremities: "Normal",
  pelvicExamFindings: "",
};

export function NewFPRecordDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
}: NewFPRecordDialogProps) {
  const isEditing = Boolean(initialData);

  // Form Tabs
  const [activeTab, setActiveTab] = React.useState("clientInfo");

  // Client Information
  const [clientId, setClientId] = React.useState("");
  const [philhealthNo, setPhilhealthNo] = React.useState("");
  const [nhts4PsStatus, setNhts4PsStatus] = React.useState<"Yes" | "No">("No");
  const [lastName, setLastName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [birthdate, setBirthdate] = React.useState("");
  const [age, setAge] = React.useState("");
  const [education, setEducation] = React.useState("High School");
  const [occupation, setOccupation] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [civilStatus, setCivilStatus] = React.useState<"Single" | "Married" | "Living-in" | "Widowed" | "Separated">("Married");
  const [religion, setReligion] = React.useState("Roman Catholic");

  // Spouse Information
  const [hasSpouse, setHasSpouse] = React.useState(true);
  const [spouseName, setSpouseName] = React.useState("");
  const [spouseBirthdate, setSpouseBirthdate] = React.useState("");
  const [spouseAge, setSpouseAge] = React.useState("");
  const [spouseEducation, setSpouseEducation] = React.useState("High School");
  const [spouseOccupation, setSpouseOccupation] = React.useState("");

  // Family Planning Information
  const [livingChildrenTotal, setLivingChildrenTotal] = React.useState("0");
  const [livingChildrenFemale, setLivingChildrenFemale] = React.useState("0");
  const [livingChildrenMale, setLivingChildrenMale] = React.useState("0");
  const [plansForMoreChildren, setPlansForMoreChildren] = React.useState<"Yes" | "No" | "Spacing" | "Undecided">("Spacing");
  const [monthlyFamilyIncome, setMonthlyFamilyIncome] = React.useState("");
  const [clientType, setClientType] = React.useState<FPClientType>("New Acceptor");
  const [reasonForFP, setReasonForFP] = React.useState<"Spacing" | "Limiting" | "Others">("Spacing");
  const [previousMethod, setPreviousMethod] = React.useState("");
  const [currentMethod, setCurrentMethod] = React.useState<string>(""); // Strictly blank by default
  const [reasonForChangingMethod, setReasonForChangingMethod] = React.useState("");

  // Assessment State
  const [medicalHistory, setMedicalHistory] = React.useState<FPMedicalHistory>(DEFAULT_MEDICAL_HISTORY);
  const [obGynHistory, setObGynHistory] = React.useState<FPObGynHistory>(DEFAULT_OB_GYN_HISTORY);
  const [stiAssessment, setStiAssessment] = React.useState<FPSTIRiskAssessment>(DEFAULT_STI_ASSESSMENT);
  const [vawAssessment, setVawAssessment] = React.useState<FPVAWAssessment>(DEFAULT_VAW_ASSESSMENT);
  const [physicalExam, setPhysicalExam] = React.useState<FPPhysicalExam>(DEFAULT_PHYSICAL_EXAM);

  // Consent & Acknowledgment
  const [consentAcknowledged, setConsentAcknowledged] = React.useState(false);
  const [consentDate, setConsentDate] = React.useState("");

  // Provider & Notes
  const [provider, setProvider] = React.useState("");
  const [facility, setFacility] = React.useState("Barangay Health Center");
  const [generalNotes, setGeneralNotes] = React.useState("");
  const [status, setStatus] = React.useState<FPClientStatus>("Active User");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Reset or Populate fields on open
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit mode: populate existing values
        setClientId(initialData.id);
        setPhilhealthNo(initialData.philhealthNo || "");
        setNhts4PsStatus(initialData.nhts4PsStatus);
        setLastName(initialData.lastName);
        setFirstName(initialData.firstName);
        setMiddleName(initialData.middleName || "");
        setBirthdate(initialData.birthdate);
        setAge(initialData.age.toString());
        setEducation(initialData.education);
        setOccupation(initialData.occupation);
        setAddress(initialData.address);
        setContactNumber(initialData.contactNumber);
        setCivilStatus(initialData.civilStatus);
        setReligion(initialData.religion);

        setHasSpouse(initialData.hasSpouse);
        setSpouseName(initialData.spouseName || "");
        setSpouseBirthdate(initialData.spouseBirthdate || "");
        setSpouseAge(initialData.spouseAge?.toString() || "");
        setSpouseEducation(initialData.spouseEducation || "High School");
        setSpouseOccupation(initialData.spouseOccupation || "");

        setLivingChildrenTotal(initialData.livingChildrenTotal.toString());
        setLivingChildrenFemale(initialData.livingChildrenFemale.toString());
        setLivingChildrenMale(initialData.livingChildrenMale.toString());
        setPlansForMoreChildren(initialData.plansForMoreChildren);
        setMonthlyFamilyIncome(initialData.monthlyFamilyIncome || "");
        setClientType(initialData.clientType);
        setReasonForFP(initialData.reasonForFP);
        setPreviousMethod(initialData.previousMethod || "");
        setCurrentMethod(initialData.currentMethod || "");
        setReasonForChangingMethod(initialData.reasonForChangingMethod || "");

        setMedicalHistory(initialData.medicalHistory || DEFAULT_MEDICAL_HISTORY);
        setObGynHistory(initialData.obGynHistory || DEFAULT_OB_GYN_HISTORY);
        setStiAssessment(initialData.stiRiskAssessment || DEFAULT_STI_ASSESSMENT);
        setVawAssessment(initialData.vawAssessment || DEFAULT_VAW_ASSESSMENT);
        setPhysicalExam(initialData.physicalExam || DEFAULT_PHYSICAL_EXAM);

        setConsentAcknowledged(initialData.consentAcknowledged);
        setConsentDate(initialData.consentDate);

        setProvider(initialData.provider);
        setFacility(initialData.facility || "Barangay Health Center");
        setGeneralNotes(initialData.generalNotes || "");
        setStatus(initialData.status);
      } else {
        // New record: strictly blank fields
        const todayStr = getTodayDateString();
        const randId = `FP-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`;
        setClientId(randId);
        setPhilhealthNo("");
        setNhts4PsStatus("No");
        setLastName("");
        setFirstName("");
        setMiddleName("");
        setBirthdate("");
        setAge("");
        setEducation("High School");
        setOccupation("");
        setAddress("");
        setContactNumber("");
        setCivilStatus("Married");
        setReligion("Roman Catholic");

        setHasSpouse(true);
        setSpouseName("");
        setSpouseBirthdate("");
        setSpouseAge("");
        setSpouseEducation("High School");
        setSpouseOccupation("");

        setLivingChildrenTotal("0");
        setLivingChildrenFemale("0");
        setLivingChildrenMale("0");
        setPlansForMoreChildren("Spacing");
        setMonthlyFamilyIncome("");
        setClientType("New Acceptor");
        setReasonForFP("Spacing");
        setPreviousMethod("");
        setCurrentMethod(""); // Blank by default, no auto-recommendation
        setReasonForChangingMethod("");

        setMedicalHistory(DEFAULT_MEDICAL_HISTORY);
        setObGynHistory(DEFAULT_OB_GYN_HISTORY);
        setStiAssessment(DEFAULT_STI_ASSESSMENT);
        setVawAssessment(DEFAULT_VAW_ASSESSMENT);
        setPhysicalExam(DEFAULT_PHYSICAL_EXAM);

        setConsentAcknowledged(false);
        setConsentDate(todayStr);

        setProvider("");
        setFacility("Barangay Health Center");
        setGeneralNotes("");
        setStatus("Active User");
      }
      setErrors({});
      setActiveTab("clientInfo");
    }
  }, [open, initialData]);

  // Handle Birthdate & Age Calculation
  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBirthdate(val);
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      if (!isNaN(birth.getTime())) {
        let calcAge = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          calcAge--;
        }
        if (calcAge >= 10 && calcAge <= 70) {
          setAge(calcAge.toString());
        }
      }
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!birthdate) errs.birthdate = "Birthdate is required";
    const numAge = parseInt(age, 10);
    if (isNaN(numAge) || numAge < 10 || numAge > 65) {
      errs.age = "Valid age (10-65) is required";
    }
    if (!address.trim()) errs.address = "Address is required";
    if (!contactNumber.trim()) errs.contactNumber = "Contact number is required";

    if (!currentMethod || !currentMethod.trim()) {
      errs.currentMethod = "Please select the current or accepted FP method";
    }

    if (!provider.trim()) {
      errs.provider = "Attending provider name is required";
    }

    if (!consentAcknowledged) {
      errs.consent = "Informed consent must be confirmed by client";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const fullName = `${lastName.trim()}, ${firstName.trim()}${middleName.trim() ? " " + middleName.trim() : ""}`;

    const clientPayload: FPClient = {
      id: clientId || `FP-${Date.now().toString().slice(-4)}`,
      philhealthNo: philhealthNo.trim() || undefined,
      nhts4PsStatus,
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      fullName,
      birthdate,
      age: parseInt(age, 10),
      education,
      occupation: occupation.trim(),
      address: address.trim(),
      contactNumber: contactNumber.trim(),
      civilStatus,
      religion,

      hasSpouse,
      spouseName: hasSpouse ? spouseName.trim() || undefined : undefined,
      spouseBirthdate: hasSpouse ? spouseBirthdate || undefined : undefined,
      spouseAge: hasSpouse && spouseAge ? parseInt(spouseAge, 10) : undefined,
      spouseEducation: hasSpouse ? spouseEducation : undefined,
      spouseOccupation: hasSpouse ? spouseOccupation.trim() || undefined : undefined,

      livingChildrenTotal: parseInt(livingChildrenTotal, 10) || 0,
      livingChildrenFemale: parseInt(livingChildrenFemale, 10) || 0,
      livingChildrenMale: parseInt(livingChildrenMale, 10) || 0,
      plansForMoreChildren,
      monthlyFamilyIncome: monthlyFamilyIncome.trim() || undefined,
      clientType,
      reasonForFP,
      previousMethod: previousMethod.trim() || undefined,
      currentMethod,
      reasonForChangingMethod: reasonForChangingMethod.trim() || undefined,

      medicalHistory,
      obGynHistory,
      stiRiskAssessment: stiAssessment,
      vawAssessment,
      physicalExam,

      consentAcknowledged,
      consentDate: consentDate || getTodayDateString(),

      provider: provider.trim(),
      facility: facility.trim(),
      generalNotes: generalNotes.trim() || undefined,

      services: initialData?.services || [],
      followUps: initialData?.followUps || [],
      status,

      registrationDate: initialData?.registrationDate || getTodayDateString(),
      lastServiceDate: initialData?.lastServiceDate,
      nextFollowUpDate: initialData?.nextFollowUpDate,
      followUpStatus: initialData?.followUpStatus,
    };

    onSave(clientPayload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-4xl" className="max-h-[92vh] flex flex-col p-0">
        <DialogHeader className="p-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? `Edit Family Planning Record (${initialData?.id})` : "New Family Planning Record"}
              </DialogTitle>
              <DialogDescription>
                DOH FP Form 1 / Individual Treatment Record (ITR) — Responsible Parenthood Registry
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 pt-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100 p-1 w-full justify-start overflow-x-auto">
                <TabsTrigger value="clientInfo" className="text-xs">
                  <User className="h-3.5 w-3.5 mr-1" />
                  1. Client &amp; Spouse Info
                </TabsTrigger>
                <TabsTrigger value="fpInfo" className="text-xs">
                  <HeartHandshake className="h-3.5 w-3.5 mr-1" />
                  2. Family Planning Info
                </TabsTrigger>
                <TabsTrigger value="assessment" className="text-xs">
                  <Stethoscope className="h-3.5 w-3.5 mr-1" />
                  3. Assessment &amp; History
                </TabsTrigger>
                <TabsTrigger value="consent" className="text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                  4. Consent &amp; Provider
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* TAB 1: CLIENT & SPOUSE INFO */}
            {activeTab === "clientInfo" && (
              <div className="space-y-5">
                {/* Client Identification */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
                    Client Identification (DOH FP Form 1)
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="clientId" className="text-xs">
                        Client ID <span className="text-slate-400 font-normal">(System generated)</span>
                      </Label>
                      <Input
                        id="clientId"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="text-xs h-9 font-mono bg-slate-50"
                        placeholder="e.g. FP-2026-001"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="philhealthNo" className="text-xs">
                        PhilHealth Number
                      </Label>
                      <Input
                        id="philhealthNo"
                        value={philhealthNo}
                        onChange={(e) => setPhilhealthNo(e.target.value)}
                        placeholder="XX-XXXXXXXXX-X"
                        className="text-xs h-9 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="nhts4PsStatus" className="text-xs">
                        NHTS / 4Ps Beneficiary
                      </Label>
                      <Select
                        id="nhts4PsStatus"
                        value={nhts4PsStatus}
                        onChange={(e) => setNhts4PsStatus(e.target.value as "Yes" | "No")}
                        className="text-xs h-9"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes (4Ps / NHTS-PR)</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-xs">
                        Last Name (Apelyido) <span className="text-rose-600">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Dela Cruz"
                        className={`text-xs h-9 ${errors.lastName ? "border-rose-500" : ""}`}
                      />
                      {errors.lastName && <p className="text-[10px] text-rose-600">{errors.lastName}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-xs">
                        First Name (Pangalan) <span className="text-rose-600">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Maria"
                        className={`text-xs h-9 ${errors.firstName ? "border-rose-500" : ""}`}
                      />
                      {errors.firstName && <p className="text-[10px] text-rose-600">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="middleName" className="text-xs">
                        Middle Name (Gitnang Pangalan)
                      </Label>
                      <Input
                        id="middleName"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        placeholder="e.g. Santos"
                        className="text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="birthdate" className="text-xs">
                        Date of Birth <span className="text-rose-600">*</span>
                      </Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={handleBirthdateChange}
                        className={`text-xs h-9 ${errors.birthdate ? "border-rose-500" : ""}`}
                      />
                      {errors.birthdate && <p className="text-[10px] text-rose-600">{errors.birthdate}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="age" className="text-xs">
                        Age <span className="text-rose-600">*</span>
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        min="10"
                        max="65"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className={`text-xs h-9 ${errors.age ? "border-rose-500" : ""}`}
                        placeholder="e.g. 28"
                      />
                      {errors.age && <p className="text-[10px] text-rose-600">{errors.age}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="civilStatus" className="text-xs">
                        Civil Status <span className="text-rose-600">*</span>
                      </Label>
                      <Select
                        id="civilStatus"
                        value={civilStatus}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setCivilStatus(val);
                          if (val === "Single") {
                            setHasSpouse(false);
                          }
                        }}
                        className="text-xs h-9"
                      >
                        <option value="Married">Married</option>
                        <option value="Living-in">Living-in / Common Law</option>
                        <option value="Single">Single</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="religion" className="text-xs">
                        Religion
                      </Label>
                      <Select
                        id="religion"
                        value={religion}
                        onChange={(e) => setReligion(e.target.value)}
                        className="text-xs h-9"
                      >
                        <option value="Roman Catholic">Roman Catholic</option>
                        <option value="Christian / Protestant">Christian / Protestant</option>
                        <option value="Islam / Muslim">Islam / Muslim</option>
                        <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                        <option value="Others">Others</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="education" className="text-xs">
                        Educational Attainment
                      </Label>
                      <Select
                        id="education"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="text-xs h-9"
                      >
                        <option value="Elementary Level/Graduate">Elementary Level / Graduate</option>
                        <option value="High School">High School Level / Graduate</option>
                        <option value="College Level/Graduate">College Level / Graduate</option>
                        <option value="Vocational">Vocational</option>
                        <option value="Post-Graduate">Post-Graduate</option>
                        <option value="None">None</option>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="occupation" className="text-xs">
                        Occupation
                      </Label>
                      <Input
                        id="occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="e.g. Homemaker, Vendor, Office Worker"
                        className="text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                      <Label htmlFor="address" className="text-xs">
                        Complete Residential Address <span className="text-rose-600">*</span>
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Purok 2, Barangay Camias"
                        className={`text-xs h-9 ${errors.address ? "border-rose-500" : ""}`}
                      />
                      {errors.address && <p className="text-[10px] text-rose-600">{errors.address}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="contactNumber" className="text-xs">
                        Contact Number <span className="text-rose-600">*</span>
                      </Label>
                      <Input
                        id="contactNumber"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="09XX-XXX-XXXX"
                        className={`text-xs h-9 ${errors.contactNumber ? "border-rose-500" : ""}`}
                      />
                      {errors.contactNumber && (
                        <p className="text-[10px] text-rose-600">{errors.contactNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Spouse Information (Optional) */}
                <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-teal-700" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Spouse Information
                      </h3>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasSpouse}
                        onChange={(e) => setHasSpouse(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Include Spouse Details</span>
                    </label>
                  </div>

                  {hasSpouse ? (
                    <div className="grid grid-cols-4 gap-3 pt-2">
                      <div className="col-span-2 space-y-1">
                        <Label htmlFor="spouseName" className="text-xs">
                          Spouse Full Name
                        </Label>
                        <Input
                          id="spouseName"
                          value={spouseName}
                          onChange={(e) => setSpouseName(e.target.value)}
                          placeholder="e.g. Juan Dela Cruz"
                          className="text-xs h-9 bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="spouseAge" className="text-xs">
                          Spouse Age
                        </Label>
                        <Input
                          id="spouseAge"
                          type="number"
                          min="15"
                          max="80"
                          value={spouseAge}
                          onChange={(e) => setSpouseAge(e.target.value)}
                          placeholder="e.g. 30"
                          className="text-xs h-9 bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="spouseEducation" className="text-xs">
                          Education
                        </Label>
                        <Select
                          id="spouseEducation"
                          value={spouseEducation}
                          onChange={(e) => setSpouseEducation(e.target.value)}
                          className="text-xs h-9 bg-white"
                        >
                          <option value="Elementary Level/Graduate">Elementary</option>
                          <option value="High School">High School</option>
                          <option value="College Level/Graduate">College</option>
                          <option value="Vocational">Vocational</option>
                          <option value="None">None</option>
                        </Select>
                      </div>

                      <div className="col-span-2 space-y-1">
                        <Label htmlFor="spouseOccupation" className="text-xs">
                          Occupation
                        </Label>
                        <Input
                          id="spouseOccupation"
                          value={spouseOccupation}
                          onChange={(e) => setSpouseOccupation(e.target.value)}
                          placeholder="e.g. Construction, Driver, Farmer"
                          className="text-xs h-9 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Spouse information is omitted for single or non-applicable clients.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: FAMILY PLANNING INFORMATION */}
            {activeTab === "fpInfo" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
                  Family Planning Registration &amp; Method Selection
                </h3>

                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="livingChildrenTotal" className="text-xs">
                      Living Children (Total)
                    </Label>
                    <Input
                      id="livingChildrenTotal"
                      type="number"
                      min="0"
                      value={livingChildrenTotal}
                      onChange={(e) => setLivingChildrenTotal(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="livingChildrenFemale" className="text-xs">
                      Female Children
                    </Label>
                    <Input
                      id="livingChildrenFemale"
                      type="number"
                      min="0"
                      value={livingChildrenFemale}
                      onChange={(e) => setLivingChildrenFemale(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="livingChildrenMale" className="text-xs">
                      Male Children
                    </Label>
                    <Input
                      id="livingChildrenMale"
                      type="number"
                      min="0"
                      value={livingChildrenMale}
                      onChange={(e) => setLivingChildrenMale(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="plansForMoreChildren" className="text-xs">
                      Plan for More Children
                    </Label>
                    <Select
                      id="plansForMoreChildren"
                      value={plansForMoreChildren}
                      onChange={(e) => setPlansForMoreChildren(e.target.value as any)}
                      className="text-xs h-9"
                    >
                      <option value="Spacing">Yes, Spacing (Pag-aagwat)</option>
                      <option value="Limiting">No, Limiting (Pag-hihinto)</option>
                      <option value="Yes">Yes, Soon</option>
                      <option value="Undecided">Undecided</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="clientType" className="text-xs">
                      Client Type <span className="text-rose-600">*</span>
                    </Label>
                    <Select
                      id="clientType"
                      value={clientType}
                      onChange={(e) => setClientType(e.target.value as FPClientType)}
                      className="text-xs h-9 font-semibold text-slate-800"
                    >
                      <option value="New Acceptor">New Acceptor (NA)</option>
                      <option value="Current User">Current User (CU)</option>
                      <option value="Changing Method">Changing Method (CM)</option>
                      <option value="Changing Clinic">Changing Clinic (CC)</option>
                      <option value="Dropout/Restart">Dropout / Restart (RS)</option>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reasonForFP" className="text-xs">
                      Reason for Family Planning
                    </Label>
                    <Select
                      id="reasonForFP"
                      value={reasonForFP}
                      onChange={(e) => setReasonForFP(e.target.value as any)}
                      className="text-xs h-9"
                    >
                      <option value="Spacing">Child Spacing</option>
                      <option value="Limiting">Limiting Family Size</option>
                      <option value="Others">Others</option>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="monthlyFamilyIncome" className="text-xs">
                      Monthly Family Income (PHP)
                    </Label>
                    <Input
                      id="monthlyFamilyIncome"
                      value={monthlyFamilyIncome}
                      onChange={(e) => setMonthlyFamilyIncome(e.target.value)}
                      placeholder="e.g. 15,000"
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label htmlFor="previousMethod" className="text-xs">
                      Previous Method Used (if any)
                    </Label>
                    <Input
                      id="previousMethod"
                      value={previousMethod}
                      onChange={(e) => setPreviousMethod(e.target.value)}
                      placeholder="e.g. Oral Pills, Condom, None"
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="currentMethod" className="text-xs">
                      Current / Accepted Method <span className="text-rose-600">*</span>
                    </Label>
                    <Select
                      id="currentMethod"
                      value={currentMethod}
                      onChange={(e) => setCurrentMethod(e.target.value)}
                      className={`text-xs h-9 font-semibold ${errors.currentMethod ? "border-rose-500" : ""}`}
                    >
                      <option value="">-- Select Method (Not Automatically Chosen) --</option>
                      <option value="Subdermal Implant">Subdermal Implant</option>
                      <option value="Interval IUD">Interval IUD</option>
                      <option value="Postpartum IUD">Postpartum IUD</option>
                      <option value="Injectable (DMPA)">Injectable (DMPA / Depo)</option>
                      <option value="Oral Contraceptive Pills (COC)">Oral Contraceptive Pills (COC)</option>
                      <option value="Oral Contraceptive Pills (POP)">Oral Contraceptive Pills (POP)</option>
                      <option value="Male Condom">Male Condom</option>
                      <option value="LAM (Lactational Amenorrhea)">LAM (Lactational Amenorrhea)</option>
                      <option value="Standard Days Method (SDM)">Standard Days Method (SDM)</option>
                      <option value="Bilateral Tubal Ligation (BTL)">Bilateral Tubal Ligation (BTL)</option>
                      <option value="No-Scalpel Vasectomy (NSV)">No-Scalpel Vasectomy (NSV)</option>
                      <option value="Cervical Mucus Method">Cervical Mucus Method</option>
                      <option value="Basal Body Temperature (BBT)">Basal Body Temperature (BBT)</option>
                      <option value="Symptothermal Method">Symptothermal Method</option>
                      <option value="Other Method">Other Method</option>
                    </Select>
                    {errors.currentMethod && (
                      <p className="text-[10px] text-rose-600">{errors.currentMethod}</p>
                    )}
                  </div>
                </div>

                {clientType === "Changing Method" && (
                  <div className="space-y-1">
                    <Label htmlFor="reasonForChangingMethod" className="text-xs">
                      Reason for Changing Method
                    </Label>
                    <Input
                      id="reasonForChangingMethod"
                      value={reasonForChangingMethod}
                      onChange={(e) => setReasonForChangingMethod(e.target.value)}
                      placeholder="e.g. Side effects experienced, Medical advice, Inconvenient"
                      className="text-xs h-9"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ASSESSMENT & HISTORY (DOH FP Form 1) */}
            {activeTab === "assessment" && (
              <div className="space-y-5 text-xs">
                {/* Medical History */}
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
                    Medical History Assessment
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Check all conditions that apply to the client (Reference: FP Form 1 Table of Risk Conditions).
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { key: "severeHeadache", label: "Severe headache / migraine" },
                      { key: "historyOfStrokeHeartAttack", label: "History of stroke / heart attack" },
                      { key: "hypertension", label: "Hypertension (BP ≥ 140/90)" },
                      { key: "coagulationDisorder", label: "Non-traumatic hematoma / blood disorder" },
                      { key: "breastCancerLump", label: "Breast cancer / breast lump" },
                      { key: "severeChestPain", label: "Severe chest pain / shortness of breath" },
                      { key: "unexplainedVaginalBleeding", label: "Unexplained vaginal bleeding" },
                      { key: "vaginalDischargeInfection", label: "Abnormal vaginal discharge / infection" },
                      { key: "jaundiceLiverDisease", label: "Jaundice / hepatitis / liver disease" },
                      { key: "smokingHabit", label: "Smoking habit (cigarettes)" },
                      { key: "takingAntiSeizureOrAntiTB", label: "Taking anti-seizure or anti-TB medications" },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={(medicalHistory as any)[item.key]}
                          onChange={(e) =>
                            setMedicalHistory((prev) => ({ ...prev, [item.key]: e.target.checked }))
                          }
                          className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Obstetrical & Gynecological History */}
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
                    Obstetrical &amp; Gynecological History
                  </h3>
                  <div className="grid grid-cols-6 gap-2 pt-1">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Gravida (G)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={obGynHistory.gravida}
                        onChange={(e) =>
                          setObGynHistory((prev) => ({ ...prev, gravida: parseInt(e.target.value, 10) || 0 }))
                        }
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Para (P)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={obGynHistory.para}
                        onChange={(e) =>
                          setObGynHistory((prev) => ({ ...prev, para: parseInt(e.target.value, 10) || 0 }))
                        }
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Full Term</Label>
                      <Input
                        type="number"
                        min="0"
                        value={obGynHistory.fullTerm}
                        onChange={(e) =>
                          setObGynHistory((prev) => ({ ...prev, fullTerm: parseInt(e.target.value, 10) || 0 }))
                        }
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Premature</Label>
                      <Input
                        type="number"
                        min="0"
                        value={obGynHistory.premature}
                        onChange={(e) =>
                          setObGynHistory((prev) => ({ ...prev, premature: parseInt(e.target.value, 10) || 0 }))
                        }
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Abortion</Label>
                      <Input
                        type="number"
                        min="0"
                        value={obGynHistory.abortion}
                        onChange={(e) =>
                          setObGynHistory((prev) => ({ ...prev, abortion: parseInt(e.target.value, 10) || 0 }))
                        }
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Living Children</Label>
                      <Input
                        type="number"
                        min="0"
                        value={obGynHistory.livingChildren}
                        onChange={(e) =>
                          setObGynHistory((prev) => ({ ...prev, livingChildren: parseInt(e.target.value, 10) || 0 }))
                        }
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Last Menstrual Period (LMP)</Label>
                      <Input
                        type="date"
                        value={obGynHistory.lmp}
                        onChange={(e) => setObGynHistory((prev) => ({ ...prev, lmp: e.target.value }))}
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Date of Last Delivery</Label>
                      <Input
                        type="date"
                        value={obGynHistory.dateOfLastDelivery || ""}
                        onChange={(e) => setObGynHistory((prev) => ({ ...prev, dateOfLastDelivery: e.target.value }))}
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Delivery Type</Label>
                      <Select
                        value={obGynHistory.typeOfLastDelivery || "None / N/A"}
                        onChange={(e) => setObGynHistory((prev) => ({ ...prev, typeOfLastDelivery: e.target.value as any }))}
                        className="text-xs h-8 bg-white"
                      >
                        <option value="None / N/A">None / N/A</option>
                        <option value="Vaginal">Normal Spontaneous (Vaginal)</option>
                        <option value="Cesarean">Cesarean Section</option>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Menstrual Flow</Label>
                      <Select
                        value={obGynHistory.menstrualFlow}
                        onChange={(e) => setObGynHistory((prev) => ({ ...prev, menstrualFlow: e.target.value as any }))}
                        className="text-xs h-8 bg-white"
                      >
                        <option value="Scanty">Scanty (Munti)</option>
                        <option value="Moderate">Moderate (Katamtaman)</option>
                        <option value="Heavy">Heavy (Malakas)</option>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* STI Risk & VAW Assessment */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
                      STI Risk Assessment
                    </h3>
                    {[
                      { key: "abnormalVaginalDischarge", label: "Abnormal vaginal discharge" },
                      { key: "genitalSoresUlcers", label: "Genital sores / ulcers" },
                      { key: "painBurningUrination", label: "Pain or burning sensation on urination" },
                      { key: "historyTreatedSTI", label: "History of treated STI" },
                      { key: "partnerWithSTISymptoms", label: "Partner has genital discharge or sores" },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer p-0.5">
                        <input
                          type="checkbox"
                          checked={(stiAssessment as any)[item.key]}
                          onChange={(e) =>
                            setStiAssessment((prev) => ({ ...prev, [item.key]: e.target.checked }))
                          }
                          className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-700">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
                      VAW (Violence Against Women) Assessment
                    </h3>
                    {[
                      { key: "unpleasantRelationship", label: "Relationship conflicts or fear of partner" },
                      { key: "partnerDisapprovesFP", label: "Partner strongly disapproves of FP" },
                      { key: "domesticViolenceHistory", label: "History of domestic/physical violence" },
                      { key: "referredToVAWDesk", label: "Referred to Barangay VAW Desk" },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer p-0.5">
                        <input
                          type="checkbox"
                          checked={(vawAssessment as any)[item.key]}
                          onChange={(e) =>
                            setVawAssessment((prev) => ({ ...prev, [item.key]: e.target.checked }))
                          }
                          className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Physical Examination */}
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
                    Physical Examination Findings
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Weight (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={physicalExam.weightKg || ""}
                        onChange={(e) =>
                          setPhysicalExam((prev) => ({ ...prev, weightKg: parseFloat(e.target.value) || undefined }))
                        }
                        placeholder="e.g. 52.5"
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Height (cm)</Label>
                      <Input
                        type="number"
                        value={physicalExam.heightCm || ""}
                        onChange={(e) =>
                          setPhysicalExam((prev) => ({ ...prev, heightCm: parseInt(e.target.value, 10) || undefined }))
                        }
                        placeholder="e.g. 155"
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Blood Pressure (BP)</Label>
                      <Input
                        value={physicalExam.bloodPressure || ""}
                        onChange={(e) => setPhysicalExam((prev) => ({ ...prev, bloodPressure: e.target.value }))}
                        placeholder="e.g. 110/70"
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Pulse Rate (bpm)</Label>
                      <Input
                        type="number"
                        value={physicalExam.pulseRate || ""}
                        onChange={(e) =>
                          setPhysicalExam((prev) => ({ ...prev, pulseRate: parseInt(e.target.value, 10) || undefined }))
                        }
                        placeholder="e.g. 78"
                        className="text-xs h-8 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CONSENT, PROVIDER & NOTES */}
            {activeTab === "consent" && (
              <div className="space-y-5">
                {/* Informed Consent Section */}
                <div className="space-y-3 rounded-lg border border-teal-200 bg-teal-50/40 p-4">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-teal-200">
                    <ShieldCheck className="h-4 w-4 text-teal-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                      Informed Consent and Acknowledgment (FP Form 1)
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    This certifies that the client has been thoroughly informed regarding the benefits, mode of action, and potential side effects of the chosen family planning method, and confirms that the decision was made freely and voluntarily without coercion.
                  </p>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentAcknowledged}
                        onChange={(e) => setConsentAcknowledged(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-xs font-medium text-slate-900">
                        Client Informed Consent Affirmed and Documented in Health Center Record <span className="text-rose-600">*</span>
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-[10px] text-rose-600 pl-6 mt-1">{errors.consent}</p>
                    )}
                  </div>

                  <div className="w-48 pt-2">
                    <Label htmlFor="consentDate" className="text-xs">
                      Consent Date
                    </Label>
                    <Input
                      id="consentDate"
                      type="date"
                      value={consentDate}
                      onChange={(e) => setConsentDate(e.target.value)}
                      className="text-xs h-9 bg-white"
                    />
                  </div>
                </div>

                {/* Provider and Facility */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
                    Service Provider &amp; Health Facility
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="provider" className="text-xs">
                        Attending Provider / BHW <span className="text-rose-600">*</span>
                      </Label>
                      <Input
                        id="provider"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        placeholder="e.g. Midwife Carmen Bautista / BHW"
                        className={`text-xs h-9 ${errors.provider ? "border-rose-500" : ""}`}
                      />
                      {errors.provider && <p className="text-[10px] text-rose-600">{errors.provider}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="facility" className="text-xs">
                        Health Facility
                      </Label>
                      <Input
                        id="facility"
                        value={facility}
                        onChange={(e) => setFacility(e.target.value)}
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="clientStatus" className="text-xs">
                        Client Record Status
                      </Label>
                      <Select
                        id="clientStatus"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as FPClientStatus)}
                        className="text-xs h-9 font-semibold"
                      >
                        <option value="Active User">Active User</option>
                        <option value="Follow-up Due">Follow-up Due</option>
                        <option value="Discontinued">Discontinued</option>
                        <option value="Referred">Referred</option>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="generalNotes" className="text-xs">
                      General Clinical Notes / Remarks
                    </Label>
                    <Textarea
                      id="generalNotes"
                      rows={3}
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      placeholder="Add administrative remarks, counseling notes, or follow-up instructions..."
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              {isEditing ? "Save Record Changes" : "Save Family Planning Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
