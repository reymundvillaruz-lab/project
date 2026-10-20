"use client";

import * as React from "react";
import {
  HealthStaffUser,
  StaffRole,
  StaffStatus,
  HealthCenterInfo,
  SystemPreferences,
  NotificationSettings,
} from "@/types/settings";

export interface UserProfileSettings {
  name: string;
  roleTitle: string;
  email: string;
  phone: string;
  station: string;
  licenseNo: string;
  avatarUrl: string | null;
}

export interface ActiveSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityPreferencesSettings {
  passwordHash: string;
  twoFactorEnabled: boolean;
  activeSessions: ActiveSession[];
}

export interface SettingsContextType {
  // Profile
  profile: UserProfileSettings;
  updateProfile: (updates: Partial<UserProfileSettings>) => void;

  // Health Center
  healthCenter: HealthCenterInfo;
  updateHealthCenter: (updates: Partial<HealthCenterInfo>) => void;

  // System Preferences
  systemPreferences: SystemPreferences;
  updateSystemPreferences: (updates: Partial<SystemPreferences>) => void;

  // Notifications
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => void;

  // Security
  securitySettings: SecurityPreferencesSettings;
  updateSecurityPassword: (
    currentPass: string,
    newPass: string
  ) => { success: boolean; message: string };
  toggleTwoFactor: () => boolean;
  terminateOtherSessions: () => void;
  terminateSession: (sessionId: string) => void;

  // Staff User Management
  staffUsers: HealthStaffUser[];
  addStaffUser: (user: HealthStaffUser) => void;
  updateStaffUser: (user: HealthStaffUser) => void;
  toggleStaffStatus: (userId: string) => void;
  resetStaffPassword: (userId: string) => string;
  deleteStaffUser: (userId: string) => void;
}

// -----------------------------------------------------------------------------
// DEFAULT DATA DEFINITIONS
// -----------------------------------------------------------------------------
export const DEFAULT_PROFILE: UserProfileSettings = {
  name: "Administrator",
  roleTitle: "Barangay Health Station Administrator",
  email: "admin@barangayhealth.gov.ph",
  phone: "",
  station: "Triage & Clinical Management Station",
  licenseNo: "",
  avatarUrl: null,
};

export const DEFAULT_HEALTH_CENTER: HealthCenterInfo = {
  name: "Barangay Health Center",
  barangay: "",
  municipalityCity: "",
  province: "",
  region: "",
  dohFacilityCode: "",
  contactNumber: "",
  emergencyHotline: "",
  operatingHours: "Monday to Friday: 8:00 AM – 5:00 PM",
  officialEmail: "admin@barangayhealth.gov.ph",
  address: "",
};

export const DEFAULT_SYSTEM_PREFERENCES: SystemPreferences = {
  theme: "light",
  defaultRoute: "/dashboard",
  language: "en",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "12h",
  autoSaveDrafts: true,
  offlineMode: true,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  consultationChime: true,
  lowStockPharmacyAlerts: true,
  highRiskMaternalAlerts: true,
  followUpDueAlerts: true,
  immunizationDefaulterAlerts: true,
  dailyCensusDigest: false,
};

export const DEFAULT_SECURITY_SETTINGS: SecurityPreferencesSettings = {
  passwordHash: "admin1234",
  twoFactorEnabled: false,
  activeSessions: [
    {
      id: "sess-1",
      device: "Current Browser Session",
      ip: "127.0.0.1",
      location: "Active Workstation",
      lastActive: "Active Now",
      isCurrent: true,
    },
  ],
};

// Strictly EMPTY - Zero mock staff users
export const DEFAULT_STAFF_USERS: HealthStaffUser[] = [];

// -----------------------------------------------------------------------------
// STORAGE KEYS
// -----------------------------------------------------------------------------
const STORAGE_PROFILE_KEY = "bhcms_settings_profile_v1";
const STORAGE_HC_KEY = "bhcms_settings_healthcenter_v1";
const STORAGE_SYSTEM_KEY = "bhcms_settings_system_v1";
const STORAGE_NOTIFS_KEY = "bhcms_settings_notifs_v1";
const STORAGE_SECURITY_KEY = "bhcms_settings_security_v1";
const STORAGE_STAFF_KEY = "bhcms_staff_users_v1";

const SettingsContext = React.createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<UserProfileSettings>(DEFAULT_PROFILE);
  const [healthCenter, setHealthCenter] = React.useState<HealthCenterInfo>(DEFAULT_HEALTH_CENTER);
  const [systemPreferences, setSystemPreferences] = React.useState<SystemPreferences>(DEFAULT_SYSTEM_PREFERENCES);
  const [notificationSettings, setNotificationSettings] = React.useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [securitySettings, setSecuritySettings] = React.useState<SecurityPreferencesSettings>(DEFAULT_SECURITY_SETTINGS);
  const [staffUsers, setStaffUsers] = React.useState<HealthStaffUser[]>(DEFAULT_STAFF_USERS);

  const isHydratedRef = React.useRef(false);

  // Hydrate on client mount
  React.useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        // Clear out legacy mock profile
        if (parsed.name === "Maria Elena Santos, RN") {
          setProfile(DEFAULT_PROFILE);
          localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
        } else {
          setProfile(parsed);
        }
      }

      const storedHc = localStorage.getItem(STORAGE_HC_KEY);
      if (storedHc) {
        const parsed = JSON.parse(storedHc);
        // Clear out legacy mock facility
        if (parsed.name === "Barangay San Jose Health Station") {
          setHealthCenter(DEFAULT_HEALTH_CENTER);
          localStorage.setItem(STORAGE_HC_KEY, JSON.stringify(DEFAULT_HEALTH_CENTER));
        } else {
          setHealthCenter(parsed);
        }
      }

      const storedSys = localStorage.getItem(STORAGE_SYSTEM_KEY);
      if (storedSys) setSystemPreferences(JSON.parse(storedSys));

      const storedNotifs = localStorage.getItem(STORAGE_NOTIFS_KEY);
      if (storedNotifs) setNotificationSettings(JSON.parse(storedNotifs));

      const storedSec = localStorage.getItem(STORAGE_SECURITY_KEY);
      if (storedSec) {
        const parsed = JSON.parse(storedSec);
        if (parsed && Array.isArray(parsed.activeSessions)) {
          // Remove legacy mock Android session
          parsed.activeSessions = parsed.activeSessions.filter(
            (s: ActiveSession) => s.id !== "sess-2"
          );
        }
        setSecuritySettings(parsed);
      }

      const storedStaff = localStorage.getItem(STORAGE_STAFF_KEY);
      if (storedStaff) {
        const parsed = JSON.parse(storedStaff);
        if (Array.isArray(parsed)) {
          // Purge any mock staff users
          const cleanedStaff = parsed.filter(
            (u: HealthStaffUser) => !u.id.startsWith("STAFF-00")
          );
          setStaffUsers(cleanedStaff);
          localStorage.setItem(STORAGE_STAFF_KEY, JSON.stringify(cleanedStaff));
        }
      }
    } catch (e) {
      console.warn("Settings hydration error:", e);
    }
    isHydratedRef.current = true;
  }, []);

  // Sync theme changes to HTML document
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const isDark =
      systemPreferences.theme === "dark" ||
      (systemPreferences.theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [systemPreferences.theme]);

  // Persist Profile
  const updateProfile = React.useCallback(
    (updates: Partial<UserProfileSettings>) => {
      setProfile((prev) => {
        const updated = { ...prev, ...updates };
        try {
          localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to persist profile settings", e);
        }
        return updated;
      });
    },
    []
  );

  // Persist Health Center
  const updateHealthCenter = React.useCallback(
    (updates: Partial<HealthCenterInfo>) => {
      setHealthCenter((prev) => {
        const updated = { ...prev, ...updates };
        try {
          localStorage.setItem(STORAGE_HC_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to persist health center settings", e);
        }
        return updated;
      });
    },
    []
  );

  // Persist System Preferences
  const updateSystemPreferences = React.useCallback(
    (updates: Partial<SystemPreferences>) => {
      setSystemPreferences((prev) => {
        const updated = { ...prev, ...updates };
        try {
          localStorage.setItem(STORAGE_SYSTEM_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to persist system preferences", e);
        }
        return updated;
      });
    },
    []
  );

  // Persist Notification Preferences
  const updateNotificationSettings = React.useCallback(
    (updates: Partial<NotificationSettings>) => {
      setNotificationSettings((prev) => {
        const updated = { ...prev, ...updates };
        try {
          localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to persist notification preferences", e);
        }
        return updated;
      });
    },
    []
  );

  // Security Operations
  const updateSecurityPassword = React.useCallback(
    (currentPass: string, newPass: string): { success: boolean; message: string } => {
      if (currentPass !== securitySettings.passwordHash && securitySettings.passwordHash !== "") {
        return { success: false, message: "Current password does not match." };
      }
      if (!newPass || newPass.length < 8) {
        return {
          success: false,
          message: "New password must be at least 8 characters long.",
        };
      }

      setSecuritySettings((prev) => {
        const updated = { ...prev, passwordHash: newPass };
        try {
          localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to persist security settings", e);
        }
        return updated;
      });

      return {
        success: true,
        message: "Administrator account password updated successfully.",
      };
    },
    [securitySettings.passwordHash]
  );

  const toggleTwoFactor = React.useCallback((): boolean => {
    let nextVal = false;
    setSecuritySettings((prev) => {
      nextVal = !prev.twoFactorEnabled;
      const updated = { ...prev, twoFactorEnabled: nextVal };
      try {
        localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to persist 2FA status", e);
      }
      return updated;
    });
    return nextVal;
  }, []);

  const terminateOtherSessions = React.useCallback(() => {
    setSecuritySettings((prev) => {
      const currentOnly = prev.activeSessions.filter((s) => s.isCurrent);
      const updated = { ...prev, activeSessions: currentOnly };
      try {
        localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to terminate other sessions", e);
      }
      return updated;
    });
  }, []);

  const terminateSession = React.useCallback((sessionId: string) => {
    setSecuritySettings((prev) => {
      const updated = {
        ...prev,
        activeSessions: prev.activeSessions.filter((s) => s.id !== sessionId),
      };
      try {
        localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to disconnect session", e);
      }
      return updated;
    });
  }, []);

  // Staff User Operations
  const persistStaffUsers = React.useCallback((users: HealthStaffUser[]) => {
    try {
      localStorage.setItem(STORAGE_STAFF_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to persist staff users", e);
    }
  }, []);

  const addStaffUser = React.useCallback(
    (newUser: HealthStaffUser) => {
      setStaffUsers((prev) => {
        const updated = [newUser, ...prev];
        persistStaffUsers(updated);
        return updated;
      });
    },
    [persistStaffUsers]
  );

  const updateStaffUser = React.useCallback(
    (updatedUser: HealthStaffUser) => {
      setStaffUsers((prev) => {
        const updated = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
        persistStaffUsers(updated);
        return updated;
      });
    },
    [persistStaffUsers]
  );

  const toggleStaffStatus = React.useCallback(
    (userId: string) => {
      setStaffUsers((prev) => {
        const updated = prev.map((u) => {
          if (u.id !== userId) return u;
          const nextStatus: StaffStatus = u.status === "Active" ? "Inactive" : "Active";
          return { ...u, status: nextStatus };
        });
        persistStaffUsers(updated);
        return updated;
      });
    },
    [persistStaffUsers]
  );

  const resetStaffPassword = React.useCallback((userId: string): string => {
    const tempPassword = `BHC-${Math.floor(100000 + Math.random() * 900000)}`;
    // Log temporary password for demonstration
    return tempPassword;
  }, []);

  const deleteStaffUser = React.useCallback(
    (userId: string) => {
      setStaffUsers((prev) => {
        const updated = prev.filter((u) => u.id !== userId);
        persistStaffUsers(updated);
        return updated;
      });
    },
    [persistStaffUsers]
  );

  const value = React.useMemo(
    () => ({
      profile,
      updateProfile,
      healthCenter,
      updateHealthCenter,
      systemPreferences,
      updateSystemPreferences,
      notificationSettings,
      updateNotificationSettings,
      securitySettings,
      updateSecurityPassword,
      toggleTwoFactor,
      terminateOtherSessions,
      terminateSession,
      staffUsers,
      addStaffUser,
      updateStaffUser,
      toggleStaffStatus,
      resetStaffPassword,
      deleteStaffUser,
    }),
    [
      profile,
      updateProfile,
      healthCenter,
      updateHealthCenter,
      systemPreferences,
      updateSystemPreferences,
      notificationSettings,
      updateNotificationSettings,
      securitySettings,
      updateSecurityPassword,
      toggleTwoFactor,
      terminateOtherSessions,
      terminateSession,
      staffUsers,
      addStaffUser,
      updateStaffUser,
      toggleStaffStatus,
      resetStaffPassword,
      deleteStaffUser,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
