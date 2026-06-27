export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  address?: string;
  role?: "user" | "admin";
};
