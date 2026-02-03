import "reflect-metadata";
import { describe, it, expect, beforeEach } from '@jest/globals';
import { customAuthChecker } from '../../src/lib/authChecker';
import { UserRole, User } from '../../src/entities/user.entity';
import { MyContext } from '../../src/index';

describe("customAuthChecker", () => {
  let context: MyContext;

  const createUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    email: "default@example.com",
    firstname: "Default",
    lastname: "User",
    role: UserRole.view,
    isPasswordChange: false,
    ...overrides,
  });

  beforeEach(() => {
    context = {
      req: {} as unknown as MyContext['req'],
      res: {} as unknown as MyContext['res'],
      cookies: {} as unknown as MyContext['cookies'],
      apiKey: 'test-api-key',
      user: null,
      token: null,
    };
  });

  it("denies access if no user", () => {
    const result: boolean = customAuthChecker({ context }, []);
    expect(result).toBe(false);
  });

  it("allows access if no roles required and user is present", () => {
    context.user = createUser();
    const result: boolean = customAuthChecker({ context }, []);
    expect(result).toBe(true);
  });

  it("allows access if user role matches required role", () => {
    context.user = createUser({ role: UserRole.admin, email: "admin@example.com" });
    const result: boolean = customAuthChecker({ context }, [UserRole.admin]);
    expect(result).toBe(true);
  });

  it("denies access if user role does not match required role", () => {
    context.user = createUser({ role: UserRole.view, email: "user@example.com" });
    const result: boolean = customAuthChecker({ context }, [UserRole.admin]);
    expect(result).toBe(false);
  });

  it("allows access if user role is among multiple required roles", () => {
    context.user = createUser({ role: UserRole.editor, email: "editor@example.com" });
    const result: boolean = customAuthChecker({ context }, [UserRole.admin, UserRole.editor]);
    expect(result).toBe(true);
  });

  it("denies access if user role is not among multiple required roles", () => {
    context.user = createUser({ role: UserRole.view, email: "viewer@example.com" });
    const result: boolean = customAuthChecker({ context }, [UserRole.admin, UserRole.editor]);
    expect(result).toBe(false);
  });

  it("allows access if required roles contain duplicates and user role matches", () => {
    context.user = createUser({ role: UserRole.admin, email: "admin2@example.com" });
    const result: boolean = customAuthChecker({ context }, [UserRole.admin, UserRole.admin]);
    expect(result).toBe(true);
  });

  it("denies access if user role is an empty string", () => {
    context.user = createUser({ role: "" as unknown as UserRole, email: "emptyrole@example.com" });
    const result: boolean = customAuthChecker({ context }, [UserRole.admin]);
    expect(result).toBe(false);
  });

  it("allows access if user role is 'view' and no roles are required", () => {
    context.user = createUser({ role: UserRole.view, email: "viewuser@example.com" });
    const result: boolean = customAuthChecker({ context }, []);
    expect(result).toBe(true);
  });
});