import * as React from "react";
import {
  FileText,
  User,
  Heart,
  CalendarCheck,
  CalendarClock,
  NotebookPen,
  AlertCircle,
  CheckCircle2,
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
import {
  MaternalRecord,
  MaternalStatus,
  TetanusToxoidStatus,
  Trimester,
  AppointmentStatus,
  PrenatalVisit,
  MaternalAppointment,
} from "@/types/maternal-care";

interface NewMaternalRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (record: MaternalRecord) => void;
  initialData?: MaternalRecord | null;
}

interface FormErrors {
  [key: string]: string;
}

export function NewMaternalRecordDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
}: NewMaternalRecordDialogProps) {
  const isEditing = Boolean(initialData);

  // Form State
  const [patientName, setPatientName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [age, setAge] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [philhealthNo, setPhilhealthNo] = React.useState("");

  // Pregnancy Information (BNC Form 1-G-a)
  const [recordDate, setRecordDate] = React.useState("");
  const [gravida, setGravida] = React.useState("1");
  const [para, setPara] = React.useState("0");
  const [lmp, setLmp] = React.useState("");
  const [edc, setEdc] = React.useState("");
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = React.useState("");
  const [tetanusToxoidStatus, setTetanusToxoidStatus] = React.useState<TetanusToxoidStatus>("None");
  const [ironFolicAcidSupplementation, setIronFolicAcidSupplementation] = React.useState("");
  const [nutritionalStatus, setNutritionalStatus] = React.useState("Normal");

  // Optional Initial Visit
  const [includeInitialVisit, setIncludeInitialVisit] = React.useState(false);
  const [visitDate, setVisitDate] = React.useState("");
  const [visitTrimester, setVisitTrimester] = React.useState<Trimester>("1st Trimester");
  const [visitNotes, setVisitNotes] = React.useState("");
  const [visitProvider, setVisitProvider] = React.useState("");
  const [visitFollowUpDate, setVisitFollowUpDate] = React.useState("");

  // Optional Initial Appointment
  const [includeInitialAppointment, setIncludeInitialAppointment] = React.useState(false);
  const [appointmentDate, setAppointmentDate] = React.useState("");
  const [appointmentPurpose, setAppointmentPurpose] = React.useState("");
  const [appointmentProvider, setAppointmentProvider] = React.useState("");
  const [appointmentStatus, setAppointmentStatus] = React.useState<AppointmentStatus>("Scheduled");
  const [appointmentNotes, setAppointmentNotes] = React.useState("");

  // General Information
  const [assignedBhw, setAssignedBhw] = React.useState("");
  const [status, setStatus] = React.useState<MaternalStatus>("Active");
  const [generalNotes, setGeneralNotes] = React.useState("");

  const [errors, setErrors] = React.useState<FormErrors>({});

  // Reset or populate fields on open
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit mode: populate with existing record
        setPatientName(initialData.patientName);
        setDateOfBirth(initialData.dateOfBirth);
        setAge(initialData.age.toString());
        setAddress(initialData.address);
        setContactNumber(initialData.contactNumber);
        setPhilhealthNo(initialData.philhealthNo || "");

        setRecordDate(initialData.recordDate);
        setGravida(initialData.gravida.toString());
        setPara(initialData.para.toString());
        setLmp(initialData.lmp);
        setEdc(initialData.edc);
        setGestationalAgeWeeks(initialData.gestationalAgeWeeks?.toString() || "");
        setTetanusToxoidStatus(initialData.tetanusToxoidStatus);
        setIronFolicAcidSupplementation(initialData.ironFolicAcidSupplementation || "");
        setNutritionalStatus(initialData.nutritionalStatus || "Normal");

        setAssignedBhw(initialData.assignedBhw);
        setStatus(initialData.status);
        setGeneralNotes(initialData.generalNotes);

        setIncludeInitialVisit(false);
        setIncludeInitialAppointment(false);
      } else {
        // Create mode: strictly EMPTY (Requirement 6: "Do not prefill the form with a fictional patient's details.")
        const todayStr = new Date().toISOString().split("T")[0];
        setPatientName("");
        setDateOfBirth("");
        setAge("");
        setAddress("");
        setContactNumber("");
        setPhilhealthNo("");

        setRecordDate(todayStr);
        setGravida("1");
        setPara("0");
        setLmp("");
        setEdc("");
        setGestationalAgeWeeks("");
        setTetanusToxoidStatus("None");
        setIronFolicAcidSupplementation("");
        setNutritionalStatus("Normal");

        setAssignedBhw("");
        setStatus("Active");
        setGeneralNotes("");

        setIncludeInitialVisit(false);
        setVisitDate(todayStr);
        setVisitTrimester("1st Trimester");
        setVisitNotes("");
        setVisitProvider("");
        setVisitFollowUpDate("");

        setIncludeInitialAppointment(false);
        setAppointmentDate("");
        setAppointmentPurpose("");
        setAppointmentProvider("");
        setAppointmentStatus("Scheduled");
        setAppointmentNotes("");
      }
      setErrors({});
    }
  }, [open, initialData]);

  // Auto-calculate Age if Date of Birth changes
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobVal = e.target.value;
    setDateOfBirth(dobVal);
    if (dobVal) {
      const birth = new Date(dobVal);
      const today = new Date();
      if (!isNaN(birth.getTime())) {
        let calculatedAge = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          calculatedAge--;
        }
        if (calculatedAge >= 10 && calculatedAge <= 70) {
          setAge(calculatedAge.toString());
        }
      }
    }
  };

  // Auto-calculate EDC (Estimated Date of Confinement = LMP + 280 days / Naegele's rule)
  const handleLmpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lmpVal = e.target.value;
    setLmp(lmpVal);
    if (lmpVal && !edc) {
      const lmpDate = new Date(lmpVal);
      if (!isNaN(lmpDate.getTime())) {
        const edcDate = new Date(lmpDate);
        edcDate.setDate(edcDate.getDate() + 280);
        setEdc(edcDate.toISOString().split("T")[0]);

        // Approximate gestational age
        const today = new Date();
        const diffMs = today.getTime() - lmpDate.getTime();
        const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        if (diffWeeks >= 0 && diffWeeks <= 42) {
          setGestationalAgeWeeks(diffWeeks.toString());
        }
      }
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!patientName.trim()) {
      errs.patientName = "Patient full name is required";
    }
    if (!dateOfBirth) {
      errs.dateOfBirth = "Date of birth is required";
    }
    const numAge = parseInt(age, 10);
    if (isNaN(numAge) || numAge < 10 || numAge > 65) {
      errs.age = "Please provide a valid maternal age (10-65)";
    }
    if (!address.trim()) {
      errs.address = "Address (Barangay/Purok) is required";
    }
    if (!contactNumber.trim()) {
      errs.contactNumber = "Contact number is required";
    }
    if (!recordDate) {
      errs.recordDate = "Record / Registration date is required";
    }
    if (!lmp) {
      errs.lmp = "Last Menstrual Period (LMP) is required";
    }
    if (!edc) {
      errs.edc = "Estimated Date of Confinement (EDC) is required";
    }
    if (!assignedBhw.trim()) {
      errs.assignedBhw = "Assigned BHW or Health Worker is required";
    }

    if (includeInitialVisit) {
      if (!visitDate) errs.visitDate = "Visit date is required";
      if (!visitNotes.trim()) errs.visitNotes = "Visit notes are required";
    }

    if (includeInitialAppointment) {
      if (!appointmentDate) errs.appointmentDate = "Appointment date is required";
      if (!appointmentPurpose.trim()) errs.appointmentPurpose = "Appointment purpose is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const existingVisits = initialData?.prenatalVisits || [];
    let updatedVisits: PrenatalVisit[] = [...existingVisits];

    if (includeInitialVisit && visitDate) {
      const newVisit: PrenatalVisit = {
        id: `VIS-${Date.now()}`,
        visitDate,
        trimester: visitTrimester,
        assignedProvider: visitProvider || assignedBhw,
        visitNotes: visitNotes.trim(),
        followUpDate: visitFollowUpDate || undefined,
      };
      updatedVisits = [newVisit, ...updatedVisits];
    }

    const existingAppointments = initialData?.appointments || [];
    let updatedAppointments: MaternalAppointment[] = [...existingAppointments];

    if (includeInitialAppointment && appointmentDate) {
      const newApt: MaternalAppointment = {
        id: `APT-${Date.now()}`,
        patientId: initialData?.id || `MAT-${Date.now().toString().slice(-4)}`,
        patientName: patientName.trim(),
        appointmentDate,
        purpose: appointmentPurpose.trim(),
        assignedProvider: appointmentProvider || assignedBhw,
        status: appointmentStatus,
        notes: appointmentNotes.trim() || undefined,
      };
      updatedAppointments = [newApt, ...updatedAppointments];
    }

    // Determine last visit & next appointment date
    const lastVisit =
      updatedVisits.length > 0
        ? [...updatedVisits].sort((a, b) => b.visitDate.localeCompare(a.visitDate))[0].visitDate
        : undefined;

    const nextApt =
      updatedAppointments.length > 0
        ? [...updatedAppointments]
            .filter((a) => a.status === "Scheduled" || a.status === "Follow-up Due")
            .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate))[0]?.appointmentDate
        : undefined;

    const recordPayload: MaternalRecord = {
      id: initialData?.id || `MAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      patientName: patientName.trim(),
      dateOfBirth,
      age: parseInt(age, 10),
      address: address.trim(),
      contactNumber: contactNumber.trim(),
      philhealthNo: philhealthNo.trim() || undefined,

      recordDate,
      gravida: parseInt(gravida, 10) || 1,
      para: parseInt(para, 10) || 0,
      lmp,
      edc,
      gestationalAgeWeeks: gestationalAgeWeeks ? parseInt(gestationalAgeWeeks, 10) : undefined,
      tetanusToxoidStatus,
      ironFolicAcidSupplementation: ironFolicAcidSupplementation.trim() || undefined,
      nutritionalStatus,

      prenatalVisits: updatedVisits,
      appointments: updatedAppointments,

      assignedBhw: assignedBhw.trim(),
      status,
      generalNotes: generalNotes.trim(),

      lastPrenatalVisit: lastVisit,
      nextAppointmentDate: nextApt,
    };

    onSave(recordPayload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-3xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? `Edit Maternal Record (${initialData?.id})` : "New Maternal Record"}
              </DialogTitle>
              <DialogDescription>
                BNC Form 1-G-a: Target Client List for Pregnant Women & Maternal Register
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-6 max-h-[72vh]">
          {/* Frontend Session Notice */}
          <div className="rounded-md bg-slate-50 border border-slate-200 p-2.5 px-3 text-[11px] text-slate-600 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-teal-700 shrink-0" />
            <span>
              <strong>Frontend Session:</strong> Changes update your current session state and dashboard statistics.
            </span>
          </div>

          {/* SECTION A: Patient Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <User className="h-4 w-4 text-teal-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                A. Patient Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor="patientName" className="text-xs">
                  Patient Full Name <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Maria Teresa Santos"
                  className={`text-xs h-9 ${errors.patientName ? "border-rose-500" : ""}`}
                />
                {errors.patientName && (
                  <p className="text-[10px] text-rose-600">{errors.patientName}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="dateOfBirth" className="text-xs">
                  Date of Birth <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={handleDobChange}
                  className={`text-xs h-9 ${errors.dateOfBirth ? "border-rose-500" : ""}`}
                />
                {errors.dateOfBirth && (
                  <p className="text-[10px] text-rose-600">{errors.dateOfBirth}</p>
                )}
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
                  placeholder="e.g. 26"
                  className={`text-xs h-9 ${errors.age ? "border-rose-500" : ""}`}
                />
                {errors.age && <p className="text-[10px] text-rose-600">{errors.age}</p>}
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

              <div className="space-y-1">
                <Label htmlFor="philhealthNo" className="text-xs">
                  PhilHealth Number (Optional)
                </Label>
                <Input
                  id="philhealthNo"
                  value={philhealthNo}
                  onChange={(e) => setPhilhealthNo(e.target.value)}
                  placeholder="XX-XXXXXXXXX-X"
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                <Label htmlFor="address" className="text-xs">
                  Complete Address (Purok/Sitio, Barangay) <span className="text-rose-600">*</span>
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
            </div>
          </div>

          {/* SECTION B: Pregnancy Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Heart className="h-4 w-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                B. Pregnancy Information (BNC Form 1-G-a)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="recordDate" className="text-xs">
                  Registration Date <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="recordDate"
                  type="date"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className={`text-xs h-9 ${errors.recordDate ? "border-rose-500" : ""}`}
                />
                {errors.recordDate && (
                  <p className="text-[10px] text-rose-600">{errors.recordDate}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="gravida" className="text-xs">
                  Gravida (G) <span className="text-slate-400 font-normal">Total Pregnancies</span>
                </Label>
                <Input
                  id="gravida"
                  type="number"
                  min="1"
                  max="20"
                  value={gravida}
                  onChange={(e) => setGravida(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="para" className="text-xs">
                  Para (P) <span className="text-slate-400 font-normal">Viable Births</span>
                </Label>
                <Input
                  id="para"
                  type="number"
                  min="0"
                  max="20"
                  value={para}
                  onChange={(e) => setPara(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="lmp" className="text-xs">
                  Last Menstrual Period (LMP) <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="lmp"
                  type="date"
                  value={lmp}
                  onChange={handleLmpChange}
                  className={`text-xs h-9 ${errors.lmp ? "border-rose-500" : ""}`}
                />
                {errors.lmp && <p className="text-[10px] text-rose-600">{errors.lmp}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="edc" className="text-xs">
                  Estimated Delivery Date (EDC / EDD) <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="edc"
                  type="date"
                  value={edc}
                  onChange={(e) => setEdc(e.target.value)}
                  className={`text-xs h-9 ${errors.edc ? "border-rose-500" : ""}`}
                />
                {errors.edc && <p className="text-[10px] text-rose-600">{errors.edc}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="gestationalAgeWeeks" className="text-xs">
                  Gestational Age (Weeks)
                </Label>
                <Input
                  id="gestationalAgeWeeks"
                  type="number"
                  min="1"
                  max="44"
                  value={gestationalAgeWeeks}
                  onChange={(e) => setGestationalAgeWeeks(e.target.value)}
                  placeholder="e.g. 24"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tetanusToxoidStatus" className="text-xs">
                  Tetanus Toxoid (TT) Status
                </Label>
                <Select
                  id="tetanusToxoidStatus"
                  value={tetanusToxoidStatus}
                  onChange={(e) => setTetanusToxoidStatus(e.target.value as TetanusToxoidStatus)}
                  className="text-xs h-9"
                >
                  <option value="None">None / Not Yet Vaccinated</option>
                  <option value="TT1">TT1 (1st Dose)</option>
                  <option value="TT2">TT2 (2nd Dose)</option>
                  <option value="TT3">TT3 (3rd Dose)</option>
                  <option value="TT4">TT4 (4th Dose)</option>
                  <option value="TT5">TT5 (Fully Protected)</option>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="nutritionalStatus" className="text-xs">
                  Nutritional Status
                </Label>
                <Select
                  id="nutritionalStatus"
                  value={nutritionalStatus}
                  onChange={(e) => setNutritionalStatus(e.target.value)}
                  className="text-xs h-9"
                >
                  <option value="Normal">Normal</option>
                  <option value="Underweight">Underweight</option>
                  <option value="Overweight">Overweight</option>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="ironFolicAcidSupplementation" className="text-xs">
                  Iron &amp; Folic Acid Supplementation
                </Label>
                <Input
                  id="ironFolicAcidSupplementation"
                  value={ironFolicAcidSupplementation}
                  onChange={(e) => setIronFolicAcidSupplementation(e.target.value)}
                  placeholder="e.g. Given 30 tablets"
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          {/* SECTION C: Prenatal Visit Information (Optional Initial Visit) */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4 text-emerald-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  C. Prenatal Visit Information
                </h3>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInitialVisit}
                  onChange={(e) => setIncludeInitialVisit(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Log Initial Visit Now</span>
              </label>
            </div>

            {includeInitialVisit && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="visitDate" className="text-xs">
                    Visit Date <span className="text-rose-600">*</span>
                  </Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className={`text-xs h-9 bg-white ${errors.visitDate ? "border-rose-500" : ""}`}
                  />
                  {errors.visitDate && (
                    <p className="text-[10px] text-rose-600">{errors.visitDate}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="visitTrimester" className="text-xs">
                    Trimester
                  </Label>
                  <Select
                    id="visitTrimester"
                    value={visitTrimester}
                    onChange={(e) => setVisitTrimester(e.target.value as Trimester)}
                    className="text-xs h-9 bg-white"
                  >
                    <option value="1st Trimester">1st Trimester</option>
                    <option value="2nd Trimester">2nd Trimester</option>
                    <option value="3rd Trimester">3rd Trimester</option>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="visitProvider" className="text-xs">
                    Assigned Provider/BHW
                  </Label>
                  <Input
                    id="visitProvider"
                    value={visitProvider}
                    onChange={(e) => setVisitProvider(e.target.value)}
                    placeholder="Defaults to assigned BHW"
                    className="text-xs h-9 bg-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label htmlFor="visitNotes" className="text-xs">
                    Visit Information / Notes <span className="text-rose-600">*</span>
                  </Label>
                  <Input
                    id="visitNotes"
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    placeholder="e.g. Normal maternal checkup, advised on nutrition"
                    className={`text-xs h-9 bg-white ${errors.visitNotes ? "border-rose-500" : ""}`}
                  />
                  {errors.visitNotes && (
                    <p className="text-[10px] text-rose-600">{errors.visitNotes}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="visitFollowUpDate" className="text-xs">
                    Follow-up Date (Optional)
                  </Label>
                  <Input
                    id="visitFollowUpDate"
                    type="date"
                    value={visitFollowUpDate}
                    onChange={(e) => setVisitFollowUpDate(e.target.value)}
                    className="text-xs h-9 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION D: Appointment and Follow-up (Optional Initial Appointment) */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CalendarClock className="h-4 w-4 text-sky-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  D. Appointment and Follow-up
                </h3>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInitialAppointment}
                  onChange={(e) => setIncludeInitialAppointment(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Schedule Next Appointment</span>
              </label>
            </div>

            {includeInitialAppointment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="appointmentDate" className="text-xs">
                    Appointment Date <span className="text-rose-600">*</span>
                  </Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className={`text-xs h-9 bg-white ${errors.appointmentDate ? "border-rose-500" : ""}`}
                  />
                  {errors.appointmentDate && (
                    <p className="text-[10px] text-rose-600">{errors.appointmentDate}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="appointmentPurpose" className="text-xs">
                    Appointment Purpose <span className="text-rose-600">*</span>
                  </Label>
                  <Input
                    id="appointmentPurpose"
                    value={appointmentPurpose}
                    onChange={(e) => setAppointmentPurpose(e.target.value)}
                    placeholder="e.g. 2nd Trimester Follow-up"
                    className={`text-xs h-9 bg-white ${errors.appointmentPurpose ? "border-rose-500" : ""}`}
                  />
                  {errors.appointmentPurpose && (
                    <p className="text-[10px] text-rose-600">{errors.appointmentPurpose}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="appointmentStatus" className="text-xs">
                    Follow-up Status
                  </Label>
                  <Select
                    id="appointmentStatus"
                    value={appointmentStatus}
                    onChange={(e) => setAppointmentStatus(e.target.value as AppointmentStatus)}
                    className="text-xs h-9 bg-white"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Follow-up Due">Follow-up Due</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label htmlFor="appointmentNotes" className="text-xs">
                    Notes
                  </Label>
                  <Input
                    id="appointmentNotes"
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    placeholder="Reminder notes for patient or BHW"
                    className="text-xs h-9 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="appointmentProvider" className="text-xs">
                    Assigned Provider/BHW
                  </Label>
                  <Input
                    id="appointmentProvider"
                    value={appointmentProvider}
                    onChange={(e) => setAppointmentProvider(e.target.value)}
                    placeholder="Defaults to assigned BHW"
                    className="text-xs h-9 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION E: Administration & General Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <NotebookPen className="h-4 w-4 text-slate-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                E. Administration &amp; General Notes
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="assignedBhw" className="text-xs">
                  Assigned Provider / BHW <span className="text-rose-600">*</span>
                </Label>
                <Input
                  id="assignedBhw"
                  value={assignedBhw}
                  onChange={(e) => setAssignedBhw(e.target.value)}
                  placeholder="e.g. BHW Elena Gomez"
                  className={`text-xs h-9 ${errors.assignedBhw ? "border-rose-500" : ""}`}
                />
                {errors.assignedBhw && (
                  <p className="text-[10px] text-rose-600">{errors.assignedBhw}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="status" className="text-xs">
                  Maternal Record Status
                </Label>
                <Select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MaternalStatus)}
                  className="text-xs h-9"
                >
                  <option value="Active">Active</option>
                  <option value="Follow-up Due">Follow-up Due</option>
                  <option value="Completed">Completed</option>
                </Select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor="generalNotes" className="text-xs">
                  General / Administrative Notes
                </Label>
                <Textarea
                  id="generalNotes"
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  rows={2}
                  placeholder="Administrative remarks, birth plan notes, or specific BHW observations..."
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3">
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
              {isEditing ? "Save Record Changes" : "Save Maternal Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
