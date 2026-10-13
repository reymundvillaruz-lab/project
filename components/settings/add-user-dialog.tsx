"use client";

import * as React from "react";
import { User, Shield, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
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
import { HealthStaffUser, StaffRole, StaffStatus } from "@/types/settings";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveUser: (user: HealthStaffUser) => void;
  userToEdit?: HealthStaffUser | null;
}

export function AddUserDialog({
  open,
  onOpenChange,
  onSaveUser,
  userToEdit,
}: AddUserDialogProps) {
  const isEditing = !!userToEdit;

  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState<StaffRole>("BHW");
  const [roleTitle, setRoleTitle] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [assignedStation, setAssignedStation] = React.useState("");
  const [status, setStatus] = React.useState<StaffStatus>("Active");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setRole(userToEdit.role);
      setRoleTitle(userToEdit.roleTitle || "");
      setEmail(userToEdit.email);
      setPhone(userToEdit.phone || "");
      setAssignedStation(userToEdit.assignedStation || "");
      setStatus(userToEdit.status);
    } else {
      setName("");
      setRole("BHW");
      setRoleTitle("Barangay Health Worker");
      setEmail("");
      setPhone("");
      setAssignedStation("Purok 1 Station Desk");
      setStatus("Active");
    }
    setError(null);
  }, [userToEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide the staff member's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid government or station email.");
      return;
    }

    const userData: HealthStaffUser = {
      id: userToEdit ? userToEdit.id : `usr-${Date.now()}`,
      name: name.trim(),
      role,
      roleTitle: roleTitle.trim() || (role === "Administrator" ? "Barangay Health Administrator" : "Barangay Health Worker"),
      email: email.trim(),
      phone: phone.trim() || "0917-000-0000",
      assignedStation: assignedStation.trim() || "General Health Station",
      status,
      lastActive: userToEdit?.lastActive || "Just now",
    };

    onSaveUser(userData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-teal-700" />
            {isEditing ? "Edit Health Center User Account" : "Add Health Center Staff User"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update role permissions, station assignment, or account status."
              : "Register a new Administrator or Barangay Health Worker (BHW) in the health center registry."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2.5 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="usrName" className="text-xs">
                  Full Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="usrName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maria Rosario Santos, RM"
                  className="text-xs h-9"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="usrRole" className="text-xs">
                  Assigned System Role <span className="text-rose-500">*</span>
                </Label>
                <Select
                  id="usrRole"
                  value={role}
                  onChange={(e) => {
                    const nextRole = e.target.value as StaffRole;
                    setRole(nextRole);
                    if (nextRole === "Administrator") {
                      setRoleTitle("Barangay Health Administrator");
                    } else if (nextRole === "BHW") {
                      setRoleTitle("Barangay Health Worker");
                    }
                  }}
                  className="text-xs h-9"
                >
                  <option value="Administrator">Administrator (Full Access)</option>
                  <option value="BHW">BHW (Barangay Health Worker)</option>
                  <option value="Nurse">Public Health Nurse</option>
                  <option value="Midwife">Rural Health Midwife</option>
                  <option value="Doctor">Municipal Health Officer / MD</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="usrStatus" className="text-xs">
                  Account Status <span className="text-rose-500">*</span>
                </Label>
                <Select
                  id="usrStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StaffStatus)}
                  className="text-xs h-9"
                >
                  <option value="Active">Active (Permitted Login)</option>
                  <option value="Inactive">Inactive (Access Suspended)</option>
                  <option value="On Leave">On Leave (Temporary Inactive)</option>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="usrTitle" className="text-xs">
                  Official Position / Designation Title
                </Label>
                <Input
                  id="usrTitle"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Lead BHW / Maternal Health Coordinator"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="usrEmail" className="text-xs">
                  Email Address <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="usrEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. r.santos@barangayhealth.gov.ph"
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="usrPhone" className="text-xs">
                  Contact Number
                </Label>
                <Input
                  id="usrPhone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0917-123-4567"
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="usrStation" className="text-xs">
                  Primary Assigned Station / Purok Area
                </Label>
                <Input
                  id="usrStation"
                  value={assignedStation}
                  onChange={(e) => setAssignedStation(e.target.value)}
                  placeholder="e.g. Purok 3 Field Outreach & Triage Desk"
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-teal-700 hover:bg-teal-800 text-xs h-8 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isEditing ? "Update Staff User" : "Create User Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
