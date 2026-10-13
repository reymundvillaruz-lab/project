import * as React from "react";
import { Plus, CheckCircle2, History } from "lucide-react";
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
import { FPClient, FPServiceRecord, FPMethod } from "@/types/family-planning";
import { getTodayDateString } from "@/lib/family-planning-utils";

interface AddFPServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: FPClient | null;
  serviceToEdit?: FPServiceRecord | null;
  onSaveService: (service: FPServiceRecord) => void;
}

export function AddFPServiceDialog({
  open,
  onOpenChange,
  client,
  serviceToEdit,
  onSaveService,
}: AddFPServiceDialogProps) {
  const isEditing = Boolean(serviceToEdit);

  const [serviceDate, setServiceDate] = React.useState("");
  const [method, setMethod] = React.useState("");
  const [suppliesGiven, setSuppliesGiven] = React.useState("");
  const [observationsComplaints, setObservationsComplaints] = React.useState("");
  const [servicesRendered, setServicesRendered] = React.useState("");
  const [laboratoryReferralNotes, setLaboratoryReferralNotes] = React.useState("");
  const [provider, setProvider] = React.useState("");
  const [nextServiceDate, setNextServiceDate] = React.useState("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      if (serviceToEdit) {
        setServiceDate(serviceToEdit.serviceDate || getTodayDateString());
        setMethod(serviceToEdit.method || client?.currentMethod || "");
        setSuppliesGiven(serviceToEdit.suppliesGiven || "");
        setObservationsComplaints(serviceToEdit.observationsComplaints || "");
        setServicesRendered(serviceToEdit.servicesRendered || "");
        setLaboratoryReferralNotes(serviceToEdit.laboratoryReferralNotes || "");
        setProvider(serviceToEdit.provider || client?.provider || "");
        setNextServiceDate(serviceToEdit.nextServiceDate || "");
      } else {
        setServiceDate(getTodayDateString());
        setMethod(client?.currentMethod || "");
        setSuppliesGiven("");
        setObservationsComplaints("");
        setServicesRendered("Contraceptive resupply and routine health worker counseling");
        setLaboratoryReferralNotes("");
        setProvider(client?.provider || "");
        setNextServiceDate("");
      }
      setErrors({});
    }
  }, [open, client, serviceToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!serviceDate) errs.serviceDate = "Service date is required";
    if (!method.trim()) errs.method = "Method is required";
    if (!servicesRendered.trim()) errs.servicesRendered = "Services rendered are required";
    if (!provider.trim()) errs.provider = "Provider is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload: FPServiceRecord = {
      id: serviceToEdit ? serviceToEdit.id : `SRV-${Date.now()}`,
      serviceDate,
      method,
      suppliesGiven: suppliesGiven.trim() || "No supplies dispensed",
      observationsComplaints: observationsComplaints.trim() || "No complaints reported",
      servicesRendered: servicesRendered.trim(),
      laboratoryReferralNotes: laboratoryReferralNotes.trim() || undefined,
      provider: provider.trim(),
      nextServiceDate: nextServiceDate.trim() || undefined,
    };

    onSaveService(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
              <History className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? "Edit Family Planning Service Record" : "Add Family Planning Service Record"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? `Update service log for ${client?.fullName} (${client?.id})`
                  : `Log contraceptive service visit for ${client?.fullName} (${client?.id})`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="srvDate" className="text-xs">
                Service Date <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="srvDate"
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className={`text-xs h-9 ${errors.serviceDate ? "border-rose-500" : ""}`}
              />
              {errors.serviceDate && <p className="text-[10px] text-rose-600">{errors.serviceDate}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="srvMethod" className="text-xs">
                Method <span className="text-rose-600">*</span>
              </Label>
              <Select
                id="srvMethod"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`text-xs h-9 ${errors.method ? "border-rose-500" : ""}`}
              >
                <option value="">-- Select Method --</option>
                <option value="Subdermal Implant">Subdermal Implant</option>
                <option value="Interval IUD">Interval IUD</option>
                <option value="Postpartum IUD">Postpartum IUD</option>
                <option value="Injectable (DMPA)">Injectable (DMPA)</option>
                <option value="Oral Contraceptive Pills (COC)">Oral Pills (COC)</option>
                <option value="Oral Contraceptive Pills (POP)">Oral Pills (POP)</option>
                <option value="Male Condom">Male Condom</option>
                <option value="LAM (Lactational Amenorrhea)">LAM</option>
                <option value="Standard Days Method (SDM)">SDM</option>
                <option value="Bilateral Tubal Ligation (BTL)">BTL</option>
                <option value="No-Scalpel Vasectomy (NSV)">NSV</option>
                <option value="Other Method">Other Method</option>
              </Select>
              {errors.method && <p className="text-[10px] text-rose-600">{errors.method}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="srvSupplies" className="text-xs">
                Supplies Given
              </Label>
              <Input
                id="srvSupplies"
                value={suppliesGiven}
                onChange={(e) => setSuppliesGiven(e.target.value)}
                placeholder="e.g. 3 blister packs, 1 vial, 10 condoms"
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="srvProvider" className="text-xs">
                Provider Name <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="srvProvider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Midwife Carmen Bautista"
                className={`text-xs h-9 ${errors.provider ? "border-rose-500" : ""}`}
              />
              {errors.provider && <p className="text-[10px] text-rose-600">{errors.provider}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="srvObservations" className="text-xs">
              Observations / Complaints / Side Effects
            </Label>
            <Input
              id="srvObservations"
              value={observationsComplaints}
              onChange={(e) => setObservationsComplaints(e.target.value)}
              placeholder="e.g. No side effects reported, vital signs normal"
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="srvRendered" className="text-xs">
              Services Rendered <span className="text-rose-600">*</span>
            </Label>
            <Textarea
              id="srvRendered"
              rows={2}
              value={servicesRendered}
              onChange={(e) => setServicesRendered(e.target.value)}
              placeholder="Describe clinical procedure, injection, or counseling provided..."
              className={`text-xs ${errors.servicesRendered ? "border-rose-500" : ""}`}
            />
            {errors.servicesRendered && (
              <p className="text-[10px] text-rose-600">{errors.servicesRendered}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="srvLab" className="text-xs">
                Laboratory / Referral Notes (Optional)
              </Label>
              <Input
                id="srvLab"
                value={laboratoryReferralNotes}
                onChange={(e) => setLaboratoryReferralNotes(e.target.value)}
                placeholder="e.g. Urine pregnancy test negative"
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="srvNextDate" className="text-xs">
                Next Service / Follow-up Date (Optional)
              </Label>
              <Input
                id="srvNextDate"
                type="date"
                value={nextServiceDate}
                onChange={(e) => setNextServiceDate(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
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
              {isEditing ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Service Entry
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
