import { UserRole } from "./navigation";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  barangay: string;
  healthCenter: string;
  assignedStation?: string;
  avatarUrl?: string;
}
