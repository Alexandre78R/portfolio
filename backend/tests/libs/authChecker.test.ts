import { customAuthChecker } from "../../src/lib/authChecker";
import { MyContext } from "../../src/index";
import { Role, User } from "@prisma/client";

const createMockUser = (overrides?: Partial<User>): User => ({
  id: 1,
  firstname: "Test",
  lastname: "User",
  email: "test@example.com",
  password: "hashedpassword",
  role: "admin",
  isPasswordChange: false,
  ...overrides,
});

const createMockContext = (user: User | null): MyContext => ({
  user,
} as MyContext);


describe("customAuthChecker", () => {
  const adminUser: User = createMockUser({ role: "admin", id: 1, firstname: "Alice" });
  const editorUser: User = createMockUser({ role: "editor", id: 2, firstname: "Bob" });
  const viewerUser: User = createMockUser({ role: "view", id: 3, firstname: "Charlie" });

  it("should return false if there is no user in the context", (): void => {
    const context: MyContext = createMockContext(null);
    const roles: Role[] = [];
    const result: boolean = customAuthChecker({ context }, roles);
    expect(result).toBe(false);
  });

  it("should return true if a user exists and no roles are required", (): void => {
    const context: MyContext = createMockContext(adminUser);
    const roles: Role[] = [];
    const result: boolean = customAuthChecker({ context }, roles);
    expect(result).toBe(true);
  });

  it("should return true if user has the required role", (): void => {
    const context: MyContext = createMockContext(adminUser);
    const roles: Role[] = ["admin"];
    const result: boolean = customAuthChecker({ context }, roles);
    expect(result).toBe(true);
  });

  it("should return false if user does not have the required role", (): void => {
    const context: MyContext = createMockContext(editorUser);
    const roles: Role[] = ["admin"];
    const result: boolean = customAuthChecker({ context }, roles);
    expect(result).toBe(false);
  });

  it("should return true if user has one of multiple required roles", (): void => {
    const context: MyContext = createMockContext(editorUser);
    const roles: Role[] = ["admin", "editor"];
    const result: boolean = customAuthChecker({ context }, roles);
    expect(result).toBe(true);
  });

  it("should return false if user has none of the multiple required roles", (): void => {
    const context: MyContext = createMockContext(viewerUser);
    const roles: Role[] = ["admin", "editor"];
    const result: boolean = customAuthChecker({ context }, roles);
    expect(result).toBe(false);
  });
});