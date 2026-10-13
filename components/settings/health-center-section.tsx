import * as React from "react";
import { Building, MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function HealthCenterSection() {
  const [name, setName] = React.useState("Barangay San Jose Health Station");
  const [barangay, setBarangay] = React.useState("Barangay San Jose");
  const [municipalityCity, setMunicipalityCity] = React.useState("San Fernando City");
  const [province, setProvince] = React.useState("Pampanga");
  const [region, setRegion] = React.useState("Region III - Central Luzon");
  const [dohFacilityCode, setDohFacilityCode] = React.useState("DOH-NHFR-035412");
  const [contactNumber, setContactNumber] = React.useState("(045) 961-2400");
  const [emergencyHotline, setEmergencyHotline] = React.useState("911 / (045) 961-9111");
  const [operatingHours, setOperatingHours] = React.useState(
    "Monday to Friday: 8:00 AM – 5:00 PM; On-Call 24/7 for Maternal & Emergency Triage"
  );
  const [officialEmail, setOfficialEmail] = React.useState(
    "sanjose.bhc@sanfernandocity.gov.ph"
  );
  const [address, setAddress] = React.useState(
    "Barangay Health Center Complex, MacArthur Highway, Barangay San Jose"
  );
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("Health Center information updated successfully.");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Building className="h-4 w-4 text-teal-700" />
          Health Center &amp; Station Information
        </CardTitle>
        <CardDescription className="text-xs">
          Official local government unit health station identity and accreditation details
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSave} className="space-y-4">
          {feedback && (
            <div className="p-3 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <Label htmlFor="hcName" className="text-xs">
                Health Center Facility Name
              </Label>
              <Input
                id="hcName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hcCode" className="text-xs">
                DOH NHFR Facility Code
              </Label>
              <Input
                id="hcCode"
                value={dohFacilityCode}
                onChange={(e) => setDohFacilityCode(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hcBarangay" className="text-xs">
                Barangay Jurisdiction
              </Label>
              <Input
                id="hcBarangay"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hcCity" className="text-xs">
                City / Municipality
              </Label>
              <Input
                id="hcCity"
                value={municipalityCity}
                onChange={(e) => setMunicipalityCity(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hcProvince" className="text-xs">
                Province
              </Label>
              <Input
                id="hcProvince"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hcRegion" className="text-xs">
                DOH Administrative Region
              </Label>
              <Input
                id="hcRegion"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hcPhone" className="text-xs">
                Primary Landline / Mobile
              </Label>
              <Input
                id="hcPhone"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="hcEmergency" className="text-xs">
                Emergency Ambulance Hotline
              </Label>
              <Input
                id="hcEmergency"
                value={emergencyHotline}
                onChange={(e) => setEmergencyHotline(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="hcHours" className="text-xs">
                Operating Schedule &amp; Clinical Hours
              </Label>
              <Input
                id="hcHours"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="hcAddress" className="text-xs">
                Complete Physical Address
              </Label>
              <Input
                id="hcAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button
              type="submit"
              size="sm"
              className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-8.5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Save Health Center Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
