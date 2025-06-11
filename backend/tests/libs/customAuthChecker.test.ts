import "reflect-metadata";
import { describe, it, expect, beforeEach } from '@jest/globals';
import { customAuthChecker } from '../../src/lib/authChecker';
import { UserRole } from '../../src/entities/user.entity';
import { MyContext } from '../../src/index';

describe("customAuthChecker", () => {
  let context: MyContext;

  beforeEach(() => {
    context = {
      req: {} as any,
      res: {} as any,
      cookies: {} as any,
      apiKey: 'test-api-key',
      user: null,
    };
  });

  it("denies access if no user", () => {
    const result = customAuthChecker({ context }, []);
    expect(result).toBe(false);
  });

  it("allows access if no roles required and user is present", () => {
    context.user = {
      id: 1,
      email: "test@example.com",
      firstname: "Test",
      lastname: "User",
      role: UserRole.view,
      isPasswordChange: false,
    };
    const result = customAuthChecker({ context }, []);
    expect(result).toBe(true);
  });

  it("allows access if user role matches required role", () => {
    context.user = {
      id: 1,
      email: "admin@example.com",
      firstname: "Admin",
      lastname: "User",
      role: UserRole.admin,
      isPasswordChange: false,
    };
    const result = customAuthChecker({ context }, [UserRole.admin]);
    expect(result).toBe(true);
  });

  it("denies access if user role does not match required role", () => {
    context.user = {
      id: 1,
      email: "user@example.com",
      firstname: "User",
      lastname: "User",
      role: UserRole.view,
      isPasswordChange: false,
    };
    const result = customAuthChecker({ context }, [UserRole.admin]);
    expect(result).toBe(false);
  });

  // --- New tests ---

  it("allows access if user role is among multiple required roles", () => {
    context.user = {
      id: 2,
      email: "editor@example.com",
      firstname: "Editor",
      lastname: "User",
      role: UserRole.editor,
      isPasswordChange: false,
    };
    const result = customAuthChecker({ context }, [UserRole.admin, UserRole.editor]);
    expect(result).toBe(true);
  });

  it("denies access if user role is not among multiple required roles", () => {
    context.user = {
      id: 3,
      email: "viewer@example.com",
      firstname: "Viewer",
      lastname: "User",
      role: UserRole.view,
      isPasswordChange: false,
    };
    const result = customAuthChecker({ context }, [UserRole.admin, UserRole.editor]);
    expect(result).toBe(false);
  });

  it("allows access if required roles contain duplicates and user role matches", () => {
    context.user = {
      id: 4,
      email: "admin2@example.com",
      firstname: "Admin2",
      lastname: "User",
      role: UserRole.admin,
      isPasswordChange: false,
    };
    const result = customAuthChecker({ context }, [UserRole.admin, UserRole.admin]);
    expect(result).toBe(true);
  });

  it("denies access if user role is an empty string", () => {
    context.user = {
      id: 5,
      email: "emptyrole@example.com",
      firstname: "Empty",
      lastname: "Role",
      role: "" as any,
      isPasswordChange: false,
    };
    const result = customAuthChecker({ context }, [UserRole.admin]);
    expect(result).toBe(false);
  });

  it("allows access if user role is 'view' and no roles are required", () => {
    context.user = {
      id: 6,
      email: "viewuser@example.com",
      firstname: "View",
      lastname: "User",
      role: UserRole.view,
      isPasswordChange: false,
    };
    const result = customAuthChecker({ context }, []);
    expect(result).toBe(true);
  });

});