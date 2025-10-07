import _ from "lodash";
import {
  generateTabs,
  checkRedirect,
  getCurrentCmdArry,
  isArgInvalid,
  checkThemeSwitch,
  checkLangSwitch,
} from "../../../src/components/Terminal/util";

describe("terminalUtils functions", () => {
  describe("generateTabs", () => {
    it("returns default 2 non-breaking spaces when no arg", () => {
      expect(generateTabs() as string).toBe("\xA0\xA0" as string);
    });

    it("adds correct number of extra tabs", () => {
      expect(generateTabs(3) as string).toBe("\xA0\xA0\xA0\xA0\xA0" as string);
    });

    it("returns 2 spaces if 0 is passed", () => {
      expect(generateTabs(0) as string).toBe("\xA0\xA0" as string);
    });
  });

  describe("checkRedirect", () => {
    it("returns true for valid socials/go/arg", () => {
      const rerender: boolean = true;
      const currentCommand: string[] = ["socials", "go", "2"];
      const command: string = "socials" as string;
      expect(checkRedirect(rerender, currentCommand, command) as boolean).toBe(true as boolean);
    });

    it("returns false if rerender is false", () => {
      expect(checkRedirect(false as boolean, ["socials", "go", "1"] as string[], "socials")).toBe(false as boolean);
    });

    it("returns false if command does not match", () => {
      expect(checkRedirect(true as boolean, ["projects", "go", "1"] as string[], "socials")).toBe(false as boolean);
    });

    it("returns false if arg is invalid", () => {
      expect(checkRedirect(true as boolean, ["socials", "go", "5"] as string[], "socials")).toBe(false as boolean);
    });
  });

  describe("getCurrentCmdArry", () => {
    it("splits first command in history correctly", () => {
      const history: string[] = ["help me", "welcome"];
      expect(getCurrentCmdArry(history as string[]) as string[]).toEqual(["help", "me"] as string[]);
    });
  });

  describe("isArgInvalid", () => {
    const options: string[] = ["1", "2", "3"];
    const action: string = "go";

    it("returns true if action does not match", () => {
      expect(isArgInvalid(["set", "1"] as string[], action as string, options as string[])).toBe(true as boolean);
    });

    it("returns true if arg not in options", () => {
      expect(isArgInvalid(["go", "4"] as string[], action as string, options as string[])).toBe(true as boolean);
    });

    it("returns true if arg length > 2", () => {
      expect(isArgInvalid(["go", "1", "extra"] as string[], action as string, options as string[])).toBe(true as boolean);
    });

    it("returns false for valid args", () => {
      expect(isArgInvalid(["go", "2"] as string[], action as string, options as string[])).toBe(false as boolean);
    });
  });

  describe("checkThemeSwitch", () => {
    const themes: string[] = ["dark", "light"] as string[];

    it("returns true for valid theme switch command", () => {
      const rerender: boolean = true as boolean;
      const cmd: string[] = ["themes", "set", "dark"] as string[];
      expect(checkThemeSwitch(rerender, cmd, themes) as boolean).toBe(true as boolean);
    });

    it("returns false if rerender false", () => {
      expect(checkThemeSwitch(false as boolean, ["themes", "set", "dark"] as string[], themes as string[])).toBe(false as boolean);
    });

    it("returns false if theme invalid", () => {
      expect(checkThemeSwitch(true as boolean, ["themes", "set", "blue"] as string[], themes as string[])).toBe(false as boolean);
    });
  });

  describe("checkLangSwitch", () => {
    const langs: string[] = ["en", "fr"] as string[];

    it("returns true for valid lang switch command", () => {
      expect(checkLangSwitch(true as boolean, ["lang", "set", "en"] as string[], langs as string[])).toBe(true as boolean);
    });

    it("returns false if rerender false", () => {
      expect(checkLangSwitch(false as boolean, ["lang", "set", "en"] as string[], langs as string[])).toBe(false as boolean);
    });

    it("returns false if lang invalid", () => {
      expect(checkLangSwitch(true as boolean, ["lang", "set", "de"] as string[], langs as string[])).toBe(false as boolean);
    });
  });
});