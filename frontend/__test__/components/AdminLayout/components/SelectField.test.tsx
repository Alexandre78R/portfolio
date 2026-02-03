import { type ReactElement, type ChangeEvent, type MouseEvent } from "react";
import { render, screen, fireEvent } from '@test-utils';
import SelectField, { type SelectOption } from "@/components/AdminLayout/components/Input/SelectField";

type Role = "user" | "admin";

const options: SelectOption<Role>[] = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

describe("SelectField Component", () => {
  it("renders select field with correct label", (): void => {
    render(
      <SelectField<Role>
        id="role-select"
        label="Role"
        value="user"
        options={options}
        onChange={(): void => {}}
      />
    );

    const selectInput: HTMLElement = screen.getByRole("combobox", { name: "Role" });
    expect(selectInput).toBeInTheDocument();
  });

  it("renders all options correctly when the menu is opened", (): void => {
    render(
      <SelectField<Role>
        id="role-select"
        label="Role"
        value="user"
        options={options}
        onChange={(): void => {}}
      />
    );

    const selectInput: HTMLElement = screen.getByRole("combobox", { name: "Role" });
    fireEvent.mouseDown(selectInput); // open the menu

    options.forEach((opt: SelectOption<Role>): void => {
      const optionElement: HTMLElement = screen.getByRole("option", { name: opt.label });
      expect(optionElement).toBeInTheDocument();
    });
  });

  it("calls onChange handler when an option is selected", (): void => {
    const handleChange: jest.Mock<void, [ChangeEvent<HTMLInputElement>]> = jest.fn();

    render(
      <SelectField<Role>
        id="role-select"
        label="Role"
        value="user"
        options={options}
        onChange={handleChange}
      />
    );

    const selectInput: HTMLElement = screen.getByRole("combobox", { name: "Role" });
    fireEvent.mouseDown(selectInput);

    const adminOption: HTMLElement = screen.getByRole("option", { name: "Admin" });
    fireEvent.click(adminOption);

    expect(handleChange).toHaveBeenCalledTimes(1);

    const eventArg: ChangeEvent<HTMLInputElement> = handleChange.mock.calls[0][0];
    expect(eventArg.target.value).toBe("admin");
  });

  it("applies custom className correctly", (): void => {
    const customClass: string = "custom-class";

    render(
      <SelectField<Role>
        id="role-select"
        label="Role"
        value="user"
        options={options}
        onChange={(): void => {}}
        className={customClass}
      />
    );

    const wrapper: HTMLDivElement | null = document.querySelector(`.MuiTextField-root.${customClass}`);
    expect(wrapper).toBeInTheDocument();
  });

  it("respects required prop when set to false", (): void => {
    render(
      <SelectField<Role>
        id="role-select"
        label="Role"
        value="user"
        options={options}
        onChange={(): void => {}}
        required={false}
      />
    );

    const label: HTMLLabelElement | null = document.querySelector('label[for="role-select"]');
    expect(label).toBeInTheDocument();
    expect(label?.textContent?.trim()).toBe("Role");
  });

  it("sets required prop correctly when true", (): void => {
    render(
      <SelectField<Role>
        id="role-select"
        label="Role"
        value="user"
        options={options}
        onChange={(): void => {}}
        required={true}
      />
    );

    const label: HTMLLabelElement | null = document.querySelector('label[for="role-select"]');
    expect(label).toBeInTheDocument();
    expect(label?.textContent).toMatch(/\*/);
  });

  it("merges custom sx prop correctly", (): void => {
    const customSx = { border: "1px solid red" };

    render(
      <SelectField<Role>
        id="role-select"
        label="Role"
        value="user"
        options={options}
        onChange={(): void => {}}
        sx={customSx}
      />
    );

    const selectInput: HTMLElement = screen.getByRole("combobox", { name: "Role" });
    expect(selectInput).toBeInTheDocument();
  });
});
