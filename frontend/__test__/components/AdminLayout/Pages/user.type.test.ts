import { UserRole, getUserRoleOptions, mapRoleToUserRole, SelectOption } from "@/components/AdminLayout/Pages/Users/user.type";
import Lang from "@/lang/typeLang";
import { Role } from "@/types/graphql";

describe("user.type.ts", (): void => {
  const mockLang: Lang = {
    messageAdminUserRoleOptionsAdmin: "Administrator",
    messageAdminUserRoleOptionsEditor: "Editor",
    messageAdminUserRoleOptionsView: "View Only",
  } as unknown as Lang;

  describe("UserRole enum", (): void => {
    it("should contain the correct string values", (): void => {
      const adminRole: string = UserRole.admin;
      const editorRole: string = UserRole.editor;
      const viewRole: string = UserRole.view;

      expect(adminRole).toBe("admin");
      expect(editorRole).toBe("editor");
      expect(viewRole).toBe("view");
    });
  });

  describe("getUserRoleOptions function", (): void => {
    it("should return an array of SelectOption<UserRole> with translated labels", (): void => {
      const options: SelectOption<UserRole>[] = getUserRoleOptions(mockLang);

      expect(options.length).toBe(3);

      const adminOption: SelectOption<UserRole> = options[0];
      const editorOption: SelectOption<UserRole> = options[1];
      const viewOption: SelectOption<UserRole> = options[2];

      expect(adminOption).toEqual({ label: "Administrator", value: UserRole.admin });
      expect(editorOption).toEqual({ label: "Editor", value: UserRole.editor });
      expect(viewOption).toEqual({ label: "View Only", value: UserRole.view });
    });
  });

  describe("mapRoleToUserRole function", (): void => {
    // Use GraphQL enum Role
    const roleAdmin: Role = Role.Admin;
    const roleEditor: Role = Role.Editor;
    const roleView: Role = Role.View;
    const unknownRole: string = "unknown"; // still need cast for testing default case

    it("should map Role.Admin to UserRole.admin", (): void => {
      const result: UserRole = mapRoleToUserRole(roleAdmin);
      expect(result).toBe(UserRole.admin);
    });

    it("should map Role.Editor to UserRole.editor", (): void => {
      const result: UserRole = mapRoleToUserRole(roleEditor);
      expect(result).toBe(UserRole.editor);
    });

    it("should map Role.View to UserRole.view", (): void => {
      const result: UserRole = mapRoleToUserRole(roleView);
      expect(result).toBe(UserRole.view);
    });

    it("should return UserRole.view for unknown or invalid roles", (): void => {
      const result: UserRole = mapRoleToUserRole(unknownRole as Role);
      expect(result).toBe(UserRole.view);
    });
  });
});
