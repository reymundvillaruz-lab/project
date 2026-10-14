import { NavItem } from "@/types/navigation";

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    iconName: "LayoutDashboard",
    description: "Overview of health center daily operations and statistics",
  },
  {
    title: "Patient Registry",
    href: "/patients",
    iconName: "Users",
    description: "Master list of registered barangay residents and patient profiles",
  },
  {
    title: "Consultation",
    href: "/consultations",
    iconName: "Stethoscope",
    description: "Daily clinical consultations, vital signs, and triage queue",
  },
  {
    title: "Immunization",
    href: "/immunization",
    iconName: "Syringe",
    description: "EPI vaccine schedules, infant cards, and booster tracking",
  },
  {
    title: "Maternal Care",
    href: "/maternal-care",
    iconName: "HeartPulse",
    description: "Prenatal checkups, high-risk tracking, and postpartum visits",
  },
  {
    title: "Family Planning",
    href: "/family-planning",
    iconName: "UserCheck",
    description: "Reproductive health services, contraceptive supplies, and counseling",
  },
  {
    title: "Appointments",
    href: "/appointments",
    iconName: "CalendarClock",
    description: "Scheduled health center visits and physician consultations",
  },
  {
    title: "Prescriptions & Medicines",
    href: "/prescriptions",
    iconName: "Pill",
    description: "Pharmacy inventory, dispensed medicines, and prescription logs",
  },
  {
    title: "Reports",
    href: "/reports",
    iconName: "FileBarChart",
    description: "FHSIS reports, demographic summaries, and DOH submissions",
  },
  {
    title: "Settings",
    href: "/settings",
    iconName: "Settings",
    description: "Station settings, staff accounts, and system preferences",
  },
];
