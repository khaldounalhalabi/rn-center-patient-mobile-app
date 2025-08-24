export enum RoleEnum {
  ADMIN = "admin",
  CUSTOMER = "customer",
  DOCTOR = "doctor",
  SECRETARY = "secretary",
  PUBLIC = "public",
}

const Roles = (): string[] => {
  return Object.values(RoleEnum);
};

export default Roles;
