import * as React from "react";
import { User, Mail, CheckCircle2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useSettings } from "@/context/settings-context";

export function ProfileSection() {
  const { profile, updateProfile } = useSettings();

  const [name, setName] = React.useState(profile.name);
  const [roleTitle, setRoleTitle] = React.useState(profile.roleTitle);
  const [email, setEmail] = React.useState(profile.email);
  const [phone, setPhone] = React.useState(profile.phone);
  const [station, setStation] = React.useState(profile.station);
  const [licenseNo, setLicenseNo] = React.useState(profile.licenseNo);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(profile.avatarUrl);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        updateProfile({ avatarUrl: result });
        setFeedback("Profile photo updated and saved successfully.");
        setTimeout(() => setFeedback(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    updateProfile({ avatarUrl: null });
    setFeedback("Profile photo removed.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      roleTitle: roleTitle.trim(),
      email: email.trim(),
      phone: phone.trim(),
      station: station.trim(),
      licenseNo: licenseNo.trim(),
      avatarUrl,
    });
    setFeedback("Administrator profile saved and updated successfully.");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-teal-700" />
            Administrator Profile
          </CardTitle>
          <CardDescription className="text-xs">
            Manage your personal healthcare practitioner profile and account details
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-teal-800 bg-teal-50 border-teal-200 text-xs">
          Role: Administrator
        </Badge>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSave} className="space-y-4">
          {feedback && (
            <div className="p-3 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Profile Header Card with Avatar */}
          <div className="flex items-center gap-4 p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="h-14 w-14 rounded-full object-cover border-2 border-teal-600 shadow-xs shrink-0"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                {name
                  .split(" ")
                  .map((w) => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "AD"}
              </div>
            )}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 truncate">{name}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate">{roleTitle}</p>
              <p className="text-[11px] text-slate-400 font-mono">{email}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1.5"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                Change Photo
              </Button>
              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={handleRemoveAvatar}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div className="space-y-1">
              <Label htmlFor="profName" className="text-xs">
                Full Name with Credentials
              </Label>
              <Input
                id="profName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="profRole" className="text-xs">
                Official Designation / Title
              </Label>
              <Input
                id="profRole"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="profEmail" className="text-xs">
                Official Government Email
              </Label>
              <Input
                id="profEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="profPhone" className="text-xs">
                Mobile / Contact Number
              </Label>
              <Input
                id="profPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="profStation" className="text-xs">
                Primary Assigned Station
              </Label>
              <Input
                id="profStation"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="profLicense" className="text-xs">
                PRC License / Accreditation No.
              </Label>
              <Input
                id="profLicense"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="text-xs h-9 font-mono"
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
              Save Profile Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
