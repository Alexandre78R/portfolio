import Lang from "@/lang/typeLang";
import { Role } from "@/types/graphql";

export enum UserRole {
  admin = "admin",
  editor = "editor",
  view = "view",
}

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

export const getUserRoleOptions = (translations: Lang): SelectOption<UserRole>[] => [
  { label: translations.messageAdminUserRoleOptionsAdmin, value: UserRole.admin },
  { label: translations.messageAdminUserRoleOptionsEditor, value: UserRole.editor },
  { label: translations.messageAdminUserRoleOptionsView, value: UserRole.view },
];

export const mapRoleToUserRole = (role: Role): UserRole => {
  switch (role) {
    case "admin":
      return UserRole.admin;
    case "editor":
      return UserRole.editor;
    case "view":
      return UserRole.view;
    default:
      return UserRole.view;
  }
};
