import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { prismaMock } from "../../singleton"; // Keep for consistency, though not used by logout
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity"; // Import User and UserRole
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("UserResolver - logout", () => {
  let resolver: UserResolver;

  const mockCookies = mockDeep<Cookies>();

  const mockAuthenticatedUser: User = {
    id: 1,
    firstname: "Logged",
    lastname: "In",
    email: "logged.in@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };


  const baseMockContext: MyContext = {
    req: {} as any,
    res: {} as any, 
    cookies: mockCookies,
    user: null,
    apiKey: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks(); 
    
    resolver = new UserResolver(prismaMock); 

    mockCookies.set.mockClear(); 
    mockCookies.get.mockClear();
  });



  it("should successfully log out an authenticated user", async () => {

    const authenticatedContext: MyContext = {
      ...baseMockContext,
      user: mockAuthenticatedUser,
    };


    const result = await resolver.logout(authenticatedContext);


    expect(result.code).toBe(200);
    expect(result.message).toBe("Logged out successfully.");


    expect(mockCookies.set).toHaveBeenCalledTimes(1);
    expect(mockCookies.set).toHaveBeenCalledWith(
      "jwt",
      "", 
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean), 
        sameSite: 'lax',
        expires: expect.any(Date), 
        path: '/',
      })
    );
    
    const setArgs = mockCookies.set.mock.calls[0];
    expect(setArgs[2]?.expires?.getTime()).toBe(0);


    
    expect(authenticatedContext.user).toBeNull();
  });

  it("should return 401 if no user is authenticated (ctx.user is null)", async () => {
    
    const unauthenticatedContext: MyContext = {
      ...baseMockContext,
      user: null,
    };

   
    const result = await resolver.logout(unauthenticatedContext);


    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");


    expect(mockCookies.set).not.toHaveBeenCalled();


    expect(unauthenticatedContext.user).toBeNull();
  });

  it("should return 500 for an unexpected server error during cookie handling", async () => {

    const authenticatedContext: MyContext = {
      ...baseMockContext,
      user: mockAuthenticatedUser,
    };


    const errorMessage = "Simulated cookie setting error";
    mockCookies.set.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });


    const result = await resolver.logout(authenticatedContext);


    expect(result.code).toBe(500);
    expect(result.message).toBe("An error occurred during logout.");
  
    expect(mockCookies.set).toHaveBeenCalledTimes(1);
  });
});