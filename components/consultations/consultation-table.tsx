"use client";

import * as React from "react";
import Link from "next/link";
import { Stethoscope, Eye, Calendar, User, FileText } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConsultationActions } from "./consultation-actions";
import { MockConsultation, ConsultationStatus } from "@/lib/mock-data/consultations";

interface ConsultationTableProps {
  consultations: MockConsultation[];
  onResetFilters?: () => void;
}

export function ConsultationTable({
  consultations,
  onResetFilters,
}: ConsultationTableProps) {
  if (consultations.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          icon={Stethoscope}
          title="No Consultations Recorded"
          description="There are currently no patient consultations in the system. Start by recording a consultation for a registered patient."
          action={{
            label: "+ Record New Consultation",
            href: "/consultations/new",
          }}
        />
      </div>
    );
  }

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="success" className="text-[10px] font-semibold">
            Completed
          </Badge>
        );
      case "Follow-up":
        return (
          <Badge variant="warning" className="text-[10px] font-semibold">
            Follow-up
          </Badge>
        );
      case "Pending":
      default:
        return (
          <Badge variant="secondary" className="text-[10px] font-semibold">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-md border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="max-h-[520px] overflow-y-auto overflow-x-auto relative">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-10 shadow-xs">
              <TableRow className="border-b border-slate-200 hover:bg-slate-100">
                <TableHead className="w-24 font-bold text-slate-700">Consultation ID</TableHead>
                <TableHead className="w-44 font-bold text-slate-700">Patient</TableHead>
              <TableHead className="w-32">Date</TableHead>
              <TableHead className="w-40">BHW / Provider</TableHead>
              <TableHead>Reason for Visit</TableHead>
              <TableHead>Diagnosis / Assessment</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-36 text-right pr-4 font-bold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((item) => (
              <TableRow key={item.id}>
                {/* 1. Consultation ID */}
                <TableCell className="font-mono font-bold text-slate-800">
                  <Link
                    href={`/consultations/${item.id}`}
                    className="hover:text-teal-700 hover:underline"
                  >
                    {item.id}
                  </Link>
                </TableCell>

                {/* 2. Patient */}
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/consultations/${item.id}`}
                      className="font-semibold text-slate-900 hover:text-teal-700 hover:underline"
                    >
                      {item.patientName}
                    </Link>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.patientId} &bull; {item.patientAge}y/{item.patientSex === "Male" ? "M" : "F"}
                    </span>
                  </div>
                </TableCell>

                {/* 3. Date */}
                <TableCell className="text-slate-600 text-xs">
                  {item.date}
                </TableCell>

                {/* 4. Provider */}
                <TableCell className="text-slate-700 font-medium text-xs">
                  {item.provider}
                </TableCell>

                {/* 5. Reason for Visit */}
                <TableCell className="text-slate-700 text-xs max-w-xs truncate">
                  {item.reasonForVisit}
                </TableCell>

                {/* 6. Diagnosis / Assessment */}
                <TableCell className="text-slate-900 font-medium text-xs max-w-xs truncate">
                  {item.diagnosis}
                </TableCell>

                {/* 7. Status */}
                <TableCell>{getStatusBadge(item.status)}</TableCell>

                {/* 8. Actions */}
                <TableCell className="text-right">
                  <ConsultationActions consultation={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total: <strong>{consultations.length}</strong> consultation{consultations.length === 1 ? "" : "s"}</span>
          {consultations.length > 10 && (
            <span className="text-slate-400 text-[11px]">Scroll table to view all</span>
          )}
        </div>
      </div>

      {/* Tablet & Mobile Card List View */}
      <div className="lg:hidden space-y-3">
        {consultations.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {item.id}
                  </span>
                  {getStatusBadge(item.status)}
                </div>
                <Link
                  href={`/consultations/${item.id}`}
                  className="font-bold text-sm text-slate-900 hover:text-teal-700 block mt-1"
                >
                  {item.patientName}
                </Link>
                <p className="text-[11px] text-slate-400 font-mono">
                  {item.patientId} &bull; {item.patientAge}y &bull; {item.patientSex}
                </p>
              </div>

              <ConsultationActions consultation={item} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Reason for Visit</span>
                <span className="font-medium text-slate-800">{item.reasonForVisit}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Diagnosis / Assessment</span>
                <span className="font-semibold text-slate-900">{item.diagnosis}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-slate-400" />
                <span>{item.date}</span>
                <span>&bull;</span>
                <span className="font-medium text-slate-700">{item.provider}</span>
              </div>

              <Link href={`/consultations/${item.id}`}>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                  <Eye className="h-3 w-3 mr-1 text-teal-700" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
