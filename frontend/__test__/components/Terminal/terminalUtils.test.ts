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
      expect(generateTabs()).toBe("\xA0\xA0");
    });

    it("adds correct number of extra tabs", () => {
      expect(generateTabs(3)).toBe("\xA0\xA0\xA0\xA0\xA0");
    });

    it("returns 2 spaces if 0 is passed", () => {
      expect(generateTabs(0)).toBe("\xA0\xA0");
    });
  });

  describe("checkRedirect", () => {
    it("returns true for valid socials/go/arg", () => {
      const rerender: boolean = true;
      const currentCommand: string[] = ["socials", "go", "2"];
      const command = "socials";
      expect(checkRedirect(rerender, currentCommand, command)).toBe(true);
    });

    it("returns false if rerender is false", () => {
      expect(checkRedirect(false, ["socials", "go", "1"], "socials")).toBe(false);
    });

    it("returns false if command does not match", () => {
      expect(checkRedirect(true, ["projects", "go", "1"], "socials")).toBe(false);
    });

    it("returns false if arg is invalid", () => {
      expect(checkRedirect(true, ["socials", "go", "5"], "socials")).toBe(false);
    });
  });

  describe("getCurrentCmdArry", () => {
    it("splits first command in history correctly", () => {
      const history: string[] = ["help me", "welcome"];
      expect(getCurrentCmdArry(history)).toEqual(["help", "me"]);
    });
  });

  describe("isArgInvalid", () => {
    const options: string[] = ["1", "2", "3"];
    const action: string = "go";

    it("returns true if action does not match", () => {
      expect(isArgInvalid(["set", "1"], action, options)).toBe(true);
    });

    it("returns true if arg not in options", () => {
      expect(isArgInvalid(["go", "4"], action, options)).toBe(true);
    });

    it("returns true if arg length > 2", () => {
      expect(isArgInvalid(["go", "1", "extra"], action, options)).toBe(true);
    });

    it("returns false for valid args", () => {
      expect(isArgInvalid(["go", "2"], action, options)).toBe(false);
    });
  });

  describe("checkThemeSwitch", () => {
    const themes: string[] = ["dark", "light"];

    it("returns true for valid theme switch command", () => {
      const rerender: boolean = true;
      const cmd: string[] = ["themes", "set", "dark"];
      expect(checkThemeSwitch(rerender, cmd, themes)).toBe(true);
    });

    it("returns false if rerender false", () => {
      expect(checkThemeSwitch(false, ["themes", "set", "dark"], themes)).toBe(false);
    });

    it("returns false if theme invalid", () => {
      expect(checkThemeSwitch(true, ["themes", "set", "blue"], themes)).toBe(false);
    });
  });

  describe("checkLangSwitch", () => {
    const langs: string[] = ["en", "fr"];

    it("returns true for valid lang switch command", () => {
      expect(checkLangSwitch(true, ["lang", "set", "en"], langs)).toBe(true);
    });

    it("returns false if rerender false", () => {
      expect(checkLangSwitch(false, ["lang", "set", "en"], langs)).toBe(false);
    });

    it("returns false if lang invalid", () => {
      expect(checkLangSwitch(true, ["lang", "set", "de"], langs)).toBe(false);
    });
  });
});