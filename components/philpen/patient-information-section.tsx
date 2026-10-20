"use client";

import * as React from "react";
import { AlertCircle, User, Building, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PhilpenPatientInfo } from "@/lib/mock-data/philpen";

interface PatientInformationSectionProps {
  data: PhilpenPatientInfo;
  onChange: (field: keyof PhilpenPatientInfo, value: any) => void;
  ageValidationError: string | null;
}

export function PatientInformationSection({
  data,
  onChange,
  ageValidationError,
}: PatientInformationSectionProps) {

  // Handle birthdate change and auto-calculate age
  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bdate = e.target.value;
    onChange("birthdate", bdate);

    if (bdate) {
      const birth = new Date(bdate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      onChange("age", Math.max(0, age));
    } else {
      onChange("age", "");
    }
  };

  return (
    <div className="space-y-6">
      {/* Age Warning Banner if under 20 */}
      {ageValidationError && (
        <div
          role="alert"
          className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 flex items-start gap-2.5 animate-in fade-in-50"
        >
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-rose-950">Age Eligibility Requirement</p>
            <p className="text-rose-800">{ageValidationError}</p>
          </div>
        </div>
      )}

      {/* Facility & Assessment Date */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5 text-teal-700" />
          Health Facility &amp; Assessment Record
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="healthFacilityName" className="block text-xs font-semibold text-slate-700 mb-1">
              Name of Health Facility <span className="text-rose-500">*</span>
            </label>
            <Input
              id="healthFacilityName"
              value={data.healthFacilityName}
              onChange={(e) => onChange("healthFacilityName", e.target.value)}
              placeholder="e.g. Barangay Health Center"
              className="text-xs"
              required
            />
          </div>

          <div>
            <label htmlFor="assessmentDate" className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Assessment <span className="text-rose-500">*</span>
            </label>
            <Input
              id="assessmentDate"
              type="date"
              value={data.assessmentDate}
              onChange={(e) => onChange("assessmentDate", e.target.value)}
              className="text-xs"
              required
            />
          </div>
        </div>
      </div>

      {/* Patient Name */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-teal-700" />
          Patient Name
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="surname" className="block text-xs font-semibold text-slate-700 mb-1">
              Surname (Apelyido) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="surname"
              value={data.surname}
              onChange={(e) => onChange("surname", e.target.value)}
              placeholder="Enter surname"
              className="text-xs"
              required
            />
          </div>

          <div>
            <label htmlFor="givenName" className="block text-xs font-semibold text-slate-700 mb-1">
              Given Name (Pangalan) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="givenName"
              value={data.givenName}
              onChange={(e) => onChange("givenName", e.target.value)}
              placeholder="Enter given name"
              className="text-xs"
              required
            />
          </div>

          <div>
            <label htmlFor="middleName" className="block text-xs font-semibold text-slate-700 mb-1">
              Middle Name (Gitnang Pangalan)
            </label>
            <Input
              id="middleName"
              value={data.middleName}
              onChange={(e) => onChange("middleName", e.target.value)}
              placeholder="Enter middle name"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Patient Demographics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="birthdate" className="block text-xs font-semibold text-slate-700 mb-1">
              Birthdate <span className="text-rose-500">*</span>
            </label>
            <Input
              id="birthdate"
              type="date"
              value={data.birthdate}
              onChange={handleBirthdateChange}
              className="text-xs"
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-xs font-semibold text-slate-700 mb-1">
              Age (Calculated) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="age"
              type="number"
              value={data.age}
              readOnly
              placeholder="Auto-calculated"
              className="text-xs bg-slate-50 font-bold text-slate-800"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Adults 20+ required</span>
          </div>

          <div>
            <label htmlFor="sex" className="block text-xs font-semibold text-slate-700 mb-1">
              Sex (Kasarian) <span className="text-rose-500">*</span>
            </label>
            <Select
              id="sex"
              value={data.sex}
              onChange={(e) => onChange("sex", e.target.value)}
              required
            >
              <option value="">Select Sex</option>
              <option value="Male">Male (Lalaki)</option>
              <option value="Female">Female (Babae)</option>
            </Select>
          </div>

          <div>
            <label htmlFor="civilStatus" className="block text-xs font-semibold text-slate-700 mb-1">
              Civil Status
            </label>
            <Select
              id="civilStatus"
              value={data.civilStatus}
              onChange={(e) => onChange("civilStatus", e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
              <option value="Cohabiting">Cohabiting (Live-in)</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label htmlFor="phicNo" className="block text-xs font-semibold text-slate-700 mb-1">
              PHIC No. (PhilHealth)
            </label>
            <Input
              id="phicNo"
              value={data.phicNo}
              onChange={(e) => onChange("phicNo", e.target.value)}
              placeholder="XX-XXXXXXXXX-X"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="religion" className="block text-xs font-semibold text-slate-700 mb-1">
              Religion
            </label>
            <Input
              id="religion"
              value={data.religion}
              onChange={(e) => onChange("religion", e.target.value)}
              placeholder="e.g. Roman Catholic, INC, Christian"
              className="text-xs"
            />
          </div>

          <div>
            <label htmlFor="contactNo" className="block text-xs font-semibold text-slate-700 mb-1">
              Contact No. <span className="text-rose-500">*</span>
            </label>
            <Input
              id="contactNo"
              value={data.contactNo}
              onChange={(e) => onChange("contactNo", e.target.value)}
              placeholder="e.g. 0917-123-4567"
              className="text-xs font-mono"
              required
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Patient&apos;s Address
        </h3>
        <div>
          <label htmlFor="address" className="block text-xs font-semibold text-slate-700 mb-1">
            Patient&apos;s Address (House No., Street, Purok, Barangay, Municipality/City) <span className="text-rose-500">*</span>
          </label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="e.g. 142 Purok 3, Barangay Central"
            className="text-xs"
            required
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="pwdIdNo" className="block text-xs font-semibold text-slate-700 mb-1">
              PWD ID Card No.
            </label>
            <Input
              id="pwdIdNo"
              value={data.pwdIdNo}
              onChange={(e) => onChange("pwdIdNo", e.target.value)}
              placeholder="PWD-XXXX-XXXX (if applicable)"
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="employmentStatus" className="block text-xs font-semibold text-slate-700 mb-1">
              Employment Status
            </label>
            <Select
              id="employmentStatus"
              value={data.employmentStatus}
              onChange={(e) => onChange("employmentStatus", e.target.value)}
            >
              <option value="">Select Employment</option>
              <option value="Employed">Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
            </Select>
          </div>

          <div>
            <label htmlFor="isIp" className="block text-xs font-semibold text-slate-700 mb-1">
              IP / Non-IP (Indigenous People)
            </label>
            <Select
              id="isIp"
              value={data.isIp}
              onChange={(e) => onChange("isIp", e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Non-IP">Non-IP</option>
              <option value="IP">IP (Indigenous People)</option>
            </Select>
          </div>

          <div>
            <label htmlFor="ethnicity" className="block text-xs font-semibold text-slate-700 mb-1">
              Ethnicity
            </label>
            <Input
              id="ethnicity"
              value={data.ethnicity}
              onChange={(e) => onChange("ethnicity", e.target.value)}
              placeholder="e.g. Tagalog, Ilocano, Cebuano"
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
