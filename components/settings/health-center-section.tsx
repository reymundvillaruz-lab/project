import * as React from "react";
import { Building, MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useSettings, DEFAULT_HEALTH_CENTER } from "@/context/settings-context";
import { RotateCcw } from "lucide-react";

export function HealthCenterSection() {
  const { healthCenter, updateHealthCenter } = useSettings();

  const [name, setName] = React.useState(healthCenter.name);
  const [barangay, setBarangay] = React.useState(healthCenter.barangay);
  const [municipalityCity, setMunicipalityCity] = React.useState(healthCenter.municipalityCity);
  const [province, setProvince] = React.useState(healthCenter.province);
  const [region, setRegion] = React.useState(healthCenter.region);
  const [dohFacilityCode, setDohFacilityCode] = React.useState(healthCenter.dohFacilityCode);
  const [contactNumber, setContactNumber] = React.useState(healthCenter.contactNumber);
  const [emergencyHotline, setEmergencyHotline] = React.useState(healthCenter.emergencyHotline);
  const [operatingHours, setOperatingHours] = React.useState(healthCenter.operatingHours);
  const [officialEmail, setOfficialEmail] = React.useState(healthCenter.officialEmail);
  const [address, setAddress] = React.useState(healthCenter.address);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    setName(healthCenter.name);
    setBarangay(healthCenter.barangay);
    setMunicipalityCity(healthCenter.municipalityCity);
    setProvince(healthCenter.province);
    setRegion(healthCenter.region);
    setDohFacilityCode(healthCenter.dohFacilityCode);
    setContactNumber(healthCenter.contactNumber);
    setEmergencyHotline(healthCenter.emergencyHotline);
    setOperatingHours(healthCenter.operatingHours);
    setOfficialEmail(healthCenter.officialEmail);
    setAddress(healthCenter.address);
  }, [healthCenter]);

  const handleResetDefaults = () => {
    updateHealthCenter(DEFAULT_HEALTH_CENTER);
    setFeedback("Restored default health center station accreditation details.");
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHealthCenter({
      name: name.trim(),
      barangay: barangay.trim(),
      municipalityCity: municipalityCity.trim(),
      province: province.trim(),
      region: region.trim(),
      dohFacilityCode: dohFacilityCode.trim(),
      contactNumber: contactNumber.trim(),
      emergencyHotline: emergencyHotline.trim(),
      operatingHours: operatingHours.trim(),
      officialEmail: officialEmail.trim(),
      address: address.trim(),
    });
    setFeedback("Health Center information saved and updated across all stations.");
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

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="text-xs text-slate-600 hover:text-slate-900 h-8.5 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              Reset to Defaults
            </Button>
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
