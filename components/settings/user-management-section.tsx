"use client";

import * as React from "react";
import {
  Users,
  UserPlus,
  Shield,
  Search,
  CheckCircle2,
  KeyRound,
  Trash2,
  Edit2,
  RefreshCw,
  ShieldAlert,
  HeartHandshake,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HealthStaffUser } from "@/types/settings";
import { AddUserDialog } from "./add-user-dialog";
import { useSettings } from "@/context/settings-context";

export function UserManagementSection() {
  const {
    staffUsers,
    addStaffUser,
    updateStaffUser,
    toggleStaffStatus,
    resetStaffPassword,
    deleteStaffUser,
  } = useSettings();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [userToEdit, setUserToEdit] = React.useState<HealthStaffUser | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleOpenAdd = () => {
    setUserToEdit(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (user: HealthStaffUser) => {
    setUserToEdit(user);
    setDialogOpen(true);
  };

  const handleSaveUser = (savedUser: HealthStaffUser) => {
    if (userToEdit) {
      updateStaffUser(savedUser);
      showFeedback(`Updated account for ${savedUser.name}.`);
    } else {
      addStaffUser(savedUser);
      showFeedback(`Added ${savedUser.name} (${savedUser.role}) to staff registry.`);
    }
  };

  const handleToggleStatus = (user: HealthStaffUser) => {
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";
    toggleStaffStatus(user.id);
    showFeedback(`Set status for ${user.name} to ${nextStatus}.`);
  };

  const handleResetPassword = (user: HealthStaffUser) => {
    const tempPass = resetStaffPassword(user.id);
    showFeedback(
      `Temporary password generated for ${user.name}: ${tempPass} (sent to ${user.email}).`
    );
  };

  const handleDeleteUser = (user: HealthStaffUser) => {
    if (confirm(`Are you sure you want to remove ${user.name} from the health center staff?`)) {
      deleteStaffUser(user.id);
      showFeedback(`Staff user ${user.name} has been removed.`);
    }
  };

  // Filter logic
  const filteredUsers = staffUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.assignedStation &&
        u.assignedStation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      roleFilter === "ALL" ? true : u.role === roleFilter;

    const matchesStatus =
      statusFilter === "ALL" ? true : u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Role counts
  const totalCount = staffUsers.length;
  const adminCount = staffUsers.filter((u) => u.role === "Administrator").length;
  const bhwCount = staffUsers.filter((u) => u.role === "BHW").length;
  const activeCount = staffUsers.filter((u) => u.status === "Active").length;

  return (
    <Card className="border border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-700" />
            User Management &amp; Staff Roles
          </CardTitle>
          <CardDescription className="text-xs">
            Manage system access, permissions, and status for Health Center Administrators and Barangay Health Workers (BHW)
          </CardDescription>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleOpenAdd}
          className="bg-teal-700 hover:bg-teal-800 text-xs shadow-xs h-8.5 gap-1.5 shrink-0"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Staff / User
        </Button>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {feedback && (
          <div className="p-3 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Staff Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <span className="text-[11px] font-medium text-slate-500 block">Total Staff Accounts</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold text-slate-900">{totalCount}</span>
              <Users className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-teal-100 bg-teal-50/40">
            <span className="text-[11px] font-medium text-teal-800 block">Administrators</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold text-teal-900">{adminCount}</span>
              <Shield className="h-4 w-4 text-teal-600" />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40">
            <span className="text-[11px] font-medium text-emerald-800 block">Barangay Health Workers (BHW)</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold text-emerald-900">{bhwCount}</span>
              <HeartHandshake className="h-4 w-4 text-emerald-600" />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <span className="text-[11px] font-medium text-slate-500 block">Active Status</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold text-emerald-700">{activeCount}</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or assigned station..."
              className="pl-8 text-xs h-9 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-36">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs h-9"
              >
                <option value="ALL">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="BHW">BHW</option>
                <option value="Nurse">Nurse</option>
                <option value="Midwife">Midwife</option>
              </Select>
            </div>

            <div className="w-36">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs h-9"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </Select>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      <div className="max-w-xs mx-auto space-y-1">
                        <Users className="h-6 w-6 mx-auto text-slate-300" />
                        <p className="font-semibold text-slate-600 text-xs">No staff users found</p>
                        <p className="text-[11px] text-slate-400">
                          Try adjusting your search criteria or add a new staff member.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const initials = user.name
                      .split(" ")
                      .map((n) => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Name Column */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                user.role === "Administrator"
                                  ? "bg-teal-700 text-white"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate">
                                {user.name}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono truncate">
                                {user.email}
                              </div>
                              {user.assignedStation && (
                                <div className="text-[10px] text-slate-400 truncate">
                                  {user.assignedStation}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {user.role === "Administrator" ? (
                            <Badge
                              variant="outline"
                              className="bg-teal-50 text-teal-800 border-teal-200 text-[11px] font-semibold gap-1"
                            >
                              <Shield className="h-3 w-3 text-teal-600" />
                              Administrator
                            </Badge>
                          ) : user.role === "BHW" ? (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[11px] font-semibold gap-1"
                            >
                              <HeartHandshake className="h-3 w-3 text-emerald-600" />
                              BHW
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-700 border-slate-200 text-[11px] font-medium"
                            >
                              {user.role}
                            </Badge>
                          )}
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                            {user.roleTitle || user.role}
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {user.status === "Active" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              Active
                            </span>
                          ) : user.status === "On Leave" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                              On Leave
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          )}
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {user.lastActive || "—"}
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1 justify-end">
                            {/* Edit Action */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEdit(user)}
                              className="h-7 px-2 text-[11px] text-slate-700 hover:text-teal-800 hover:bg-teal-50 hover:border-teal-300 gap-1"
                              title="Edit User Profile"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </Button>

                            {/* Status Toggle Action */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(user)}
                              className={`h-7 px-2 text-[11px] gap-1 ${
                                user.status === "Active"
                                  ? "text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                                  : "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                              }`}
                              title={user.status === "Active" ? "Deactivate Account" : "Activate Account"}
                            >
                              <RefreshCw className="h-3 w-3" />
                              {user.status === "Active" ? "Suspend" : "Activate"}
                            </Button>

                            {/* Password Reset Action */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResetPassword(user)}
                              className="h-7 w-7 p-0 text-slate-500 hover:text-teal-700 hover:bg-teal-50"
                              title="Reset Password"
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                            </Button>

                            {/* Delete Action */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Account"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Helpful Station Note */}
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-teal-700 shrink-0" />
            <span>
              <strong>Role Access Summary:</strong> Administrators have full station configuration and clinical write privileges. BHWs (Barangay Health Workers) have vital signs, triage, and patient follow-up logging capabilities.
            </span>
          </div>
          <span className="font-mono text-slate-400 shrink-0 ml-4">
            Total Records: {filteredUsers.length}
          </span>
        </div>
      </CardContent>

      {/* Add / Edit User Dialog */}
      <AddUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaveUser={handleSaveUser}
        userToEdit={userToEdit}
      />
    </Card>
  );
}
