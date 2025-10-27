import React, { ReactNode, ChangeEvent, MouseEvent } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChoicePasswordPage, { ChoicePasswordFormState } from "@/pages/admin/auth/ChoicePassword";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({ children, title }: { children: ReactNode; title?: string }) => (
    <div data-testid="auth-form-layout">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({
    text,
    onClick,
  }: {
    text: string;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  }) => <button onClick={onClick}>{text}</button>,
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: ({
    id,
    name,
    label,
    value,
    onChange,
  }: {
    id: string;
    name: string;
    label?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} value={value} onChange={onChange} />
    </div>
  ),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

describe("ChoicePasswordPage", () => {
  const mockTranslations = {
    messagePageChoicePasswordTitle: "Changer le mot de passe",
    messagePageChoicePasswordOld: "Ancien mot de passe",
    messagePageChoicePasswordNew: "Nouveau mot de passe",
    messagePageChoicePasswordButton: "Valider",
  } as Lang;

  beforeEach((): void => {
    (useLang as jest.Mock).mockReturnValue({ translations: mockTranslations });
  });

  it("devrait render correctement le layout et les titres", (): void => {
    render(<ChoicePasswordPage />);

    const layout: HTMLElement = screen.getByTestId("auth-form-layout");
    expect(layout).toBeInTheDocument();

    const titleElement: HTMLElement | null = screen.getByText(
      mockTranslations.messagePageChoicePasswordTitle
    );
    expect(titleElement).toBeInTheDocument();

    const oldPasswordInput: HTMLInputElement = screen.getByLabelText(
      mockTranslations.messagePageChoicePasswordOld
    ) as HTMLInputElement;
    const newPasswordInput: HTMLInputElement = screen.getByLabelText(
      mockTranslations.messagePageChoicePasswordNew
    ) as HTMLInputElement;

    expect(oldPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toBeInTheDocument();

    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: mockTranslations.messagePageChoicePasswordButton,
    }) as HTMLButtonElement;

    expect(submitButton).toBeInTheDocument();
  });

  it("devrait mettre à jour l'état du formulaire lors de la saisie", async (): Promise<void> => {
    render(<ChoicePasswordPage />);

    const oldPasswordInput: HTMLInputElement = screen.getByLabelText(
      mockTranslations.messagePageChoicePasswordOld
    ) as HTMLInputElement;
    const newPasswordInput: HTMLInputElement = screen.getByLabelText(
      mockTranslations.messagePageChoicePasswordNew
    ) as HTMLInputElement;

    fireEvent.change(oldPasswordInput, { target: { value: "ancien123" } });
    fireEvent.change(newPasswordInput, { target: { value: "nouveau456" } });

    await waitFor((): void => {
      expect(oldPasswordInput.value).toBe("ancien123");
      expect(newPasswordInput.value).toBe("nouveau456");
    });
  });

  it("devrait appeler handleSubmit lors du submit du formulaire", async (): Promise<void> => {
    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> =
      jest.spyOn(console, "log").mockImplementation((): void => {});

    render(<ChoicePasswordPage />);

    const oldPasswordInput: HTMLInputElement = screen.getByLabelText(
      mockTranslations.messagePageChoicePasswordOld
    ) as HTMLInputElement;
    const newPasswordInput: HTMLInputElement = screen.getByLabelText(
      mockTranslations.messagePageChoicePasswordNew
    ) as HTMLInputElement;
    const submitButton: HTMLButtonElement = screen.getByRole("button", {
      name: mockTranslations.messagePageChoicePasswordButton,
    }) as HTMLButtonElement;

    fireEvent.change(oldPasswordInput, { target: { value: "ancien123" } });
    fireEvent.change(newPasswordInput, { target: { value: "nouveau456" } });

    fireEvent.click(submitButton);

    await waitFor((): void => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Changement de mot de passe !",
        {
          password: "ancien123",
          newPassword: "nouveau456",
        } as ChoicePasswordFormState
      );
    });

    consoleSpy.mockRestore();
  });
});