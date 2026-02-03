import { checkApiKey } from "../../src/lib/checkApiKey";

describe("checkApiKey", (): void => {
  const OLD_ENV: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    process.env = { ...OLD_ENV };
    process.env.API_KEY = "my-secret-api-key";
  });

  afterEach((): void => {
    process.env = OLD_ENV;
  });

  it("should return true if the provided API key matches", (): void => {
    const apiKey: string = "my-secret-api-key";
    const result: boolean = checkApiKey(apiKey);
    expect(result).toBe(true);
  });

  it("should throw an error if the provided API key does not match", (): void => {
    const apiKey: string = "wrong-api-key";
    expect((): boolean => checkApiKey(apiKey)).toThrowError("Unauthorized TOKEN API");
  });

  it("should throw an error if API_KEY environment variable is undefined", (): void => {
    delete process.env.API_KEY;
    const apiKey: string = "my-secret-api-key";
    expect((): boolean => checkApiKey(apiKey)).toThrowError("Unauthorized TOKEN API");
  });
});