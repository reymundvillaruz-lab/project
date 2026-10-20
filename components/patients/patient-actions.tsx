"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Edit3, Stethoscope, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockPatient } from "@/lib/mock-data/patients";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface PatientActionsProps {
  patient: MockPatient;
  onDelete?: (id: string, name: string) => Promise<void> | void;
}

export function PatientActions({ patient, onDelete }: PatientActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(patient.id, patient.fullName);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Link href={`/patients/${patient.id}`}>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-teal-700 hover:bg-teal-50 hover:text-teal-900"
            title="View Patient Profile"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            <span>View</span>
          </Button>
        </Link>

        <Link href={`/patients/new?edit=${patient.id}`}>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            title="Edit Patient Record"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            <span>Edit</span>
          </Button>
        </Link>

        <Link href={`/consultations/new?patientId=${patient.id}`}>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-sky-700 hover:bg-sky-50 hover:text-sky-900"
            title="Start Consultation"
          >
            <Stethoscope className="h-3.5 w-3.5 mr-1" />
            <span>Consult</span>
          </Button>
        </Link>

        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-800"
            title="Delete Patient Record"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span>Delete</span>
          </Button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-700 flex items-center gap-2 text-base">
              <Trash2 className="h-5 w-5 text-rose-600" />
              Delete Patient Record
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-1 leading-relaxed">
              Are you sure you want to permanently delete the patient record for{" "}
              <strong className="text-slate-900">{patient.fullName}</strong> (
              <span className="font-mono text-slate-800">{patient.id}</span>)?
              <br />
              <span className="text-rose-600 font-medium mt-1 block">
                This record will be immediately removed from the Supabase database.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDelete}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                  Deleting from Supabase...
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
