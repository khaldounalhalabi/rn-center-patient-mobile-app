import { LANGUAGE_KEY } from "@/context/LanguageProvider";
import { RoleEnum } from "@/enums/RoleEnum";
import { User } from "@/models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setToken(token?: string, refreshToken?: string) {
  await AsyncStorage.setItem("token", token ?? "");
  await AsyncStorage.setItem("refresh_token", refreshToken ?? "");
}

export async function getToken(): Promise<string | undefined> {
  return (await AsyncStorage.getItem("token")) as string | undefined;
}

export async function deleteTokens() {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("refresh_token");
}

export async function setRole(role?: string) {
  await AsyncStorage.setItem("role", role ?? "");
}

export async function getRole(): Promise<RoleEnum | undefined> {
  return (await AsyncStorage.getItem("role")) as RoleEnum | undefined;
}

export async function deleteRole() {
  await AsyncStorage.removeItem("role");
}

export async function setOtp(code?: string) {
  await AsyncStorage.setItem("otp_code", code ?? "");
}

export async function getOtp(): Promise<string | undefined> {
  const otp = await AsyncStorage.getItem("otp_code");
  await AsyncStorage.removeItem("otp_code");
  return otp ?? undefined;
}

export async function setPhone(phone?: string) {
  await AsyncStorage.setItem("phone", phone ?? "");
}

export async function getPhone(): Promise<string | undefined> {
  const phone = await AsyncStorage.getItem("phone");
  await AsyncStorage.removeItem("phone");
  return phone ?? undefined;
}

export async function setUser(user?: User) {
  if (user) {
    await AsyncStorage.setItem("user_storage_key", JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem("user_storage_key");
  }
}

export async function getUser(): Promise<User | undefined> {
  const user = await AsyncStorage.getItem("user_storage_key");
  return user ? JSON.parse(user) : undefined;
}

export async function deleteUser() {
  await AsyncStorage.removeItem("user_storage_key");
}

export function getNestedPropertyValue(object: any, path: string): any {
  const properties = path.split(".");
  let value = object;
  for (const property of properties) {
    if (value?.hasOwnProperty(property)) {
      value = value[`${property}`];
    } else {
      return undefined;
    }
  }
  return value;
}

export const sanitizeString = (str: string): string => {
  return str
    .replace("_ids", " ")
    .replace("_id", " ")
    .replace(".", " ")
    .replace("_", " ")
    .replace(" id ", " ")
    .replace(" ids ", " ");
};

export function getEnumValues<T extends object>(enumObj: T): T[keyof T][] {
  return Object.values(enumObj).filter(
    (value) => typeof value === "string" || typeof value === "number",
  ) as T[keyof T][];
}

export async function getLocale() {
  return (await AsyncStorage.getItem(LANGUAGE_KEY)) ?? "en";
}
