import React, { ReactElement } from "react";
import { render, RenderResult } from '@testing-library/react';
import CV from "@/components/Terminal/components/Commands/CV";
import { termContext, Term } from "@/components/Terminal/Terminal";
import { getCurrentCmdArry } from "@/components/Terminal/util";
import { useCvQuery } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";
import { useLang } from "@/context/Lang/LangContext";
import type Lang from "@/lang/typeLang";

jest.mock("@/components/Terminal/util", () => ({
  getCurrentCmdArry: jest.fn(),
}));

jest.mock("@/types/graphql", () => ({
  useCvQuery: jest.fn(),
}));

const showAlertMock: jest.Mock<(type: "success" | "error", message: string) => void> = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({ showAlert: showAlertMock })),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

describe("CV command component", (): void => {
  const translations: Lang = {
    titleAboutMe: "About Me",
    descriptionAboutMe1: "Description 1",
    descriptionAboutMe2: "Description 2",
    descriptionAboutMe3: "Description 3",
    buttonCV: "Download CV",
    messageCVLoading: "Loading CV...",
    messageCVNotFetch: "Error fetching CV",
    messageCVNotFound: "CV not found",
  } as Lang;

  const mockWindowOpen: jest.SpyInstance = jest.spyOn(window, "open").mockImplementation(() => null);

  const renderWithContext = (contextValue: Term): RenderResult =>
    render(
      <termContext.Provider value={contextValue}>
        <CV />
      </termContext.Provider>
    );

  beforeEach((): void => {
    (getCurrentCmdArry as jest.Mock).mockReset();
    (useLang as jest.Mock).mockReturnValue({ translations });
    (CustomToast as jest.Mock).mockReturnValue({ showAlert: showAlertMock });
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: false, error: null });
    jest.clearAllMocks();
  });

  afterAll((): void => {
    jest.restoreAllMocks();
  });

  it("opens CV when rerender is true and command is 'cv' with data.cvUrl", (): void => {
    const mockCmdArray: string[] = ["cv"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);

    const cvUrl: string = "/api/uploads/cv/Alexandre-Renard-CV.pdf";
    (useCvQuery as jest.Mock).mockReturnValue({ data: { cvUrl }, loading: false, error: null });

    const contextValue: Term = { history: [], rerender: true, arg: [], index: 0 };
    renderWithContext(contextValue);

    const expectedUrl: string = `${process.env.NEXT_PUBLIC_API_URL || window.location.origin}${cvUrl}`;
    expect(mockWindowOpen).toHaveBeenCalledWith(expectedUrl, "_blank");
  });

  it("shows loading alert if GraphQL query is loading", (): void => {
    const mockCmdArray: string[] = ["cv"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: true, error: null });

    const contextValue: Term = { history: [], rerender: true, arg: [], index: 0 };
    renderWithContext(contextValue);

    expect(showAlertMock).toHaveBeenCalledWith("error", translations.messageCVLoading);
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("shows error alert if GraphQL query failed", (): void => {
    const mockCmdArray: string[] = ["cv"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);
    (useCvQuery as jest.Mock).mockReturnValue({ data: null, loading: false, error: new Error("fail") });

    const contextValue: Term = { history: [], rerender: true, arg: [], index: 0 };
    renderWithContext(contextValue);

    expect(showAlertMock).toHaveBeenCalledWith("error", translations.messageCVNotFetch);
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("shows CV not found alert if data.cvUrl is null", (): void => {
    const mockCmdArray: string[] = ["cv"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);
    (useCvQuery as jest.Mock).mockReturnValue({ data: { cvUrl: null }, loading: false, error: null });

    const contextValue: Term = { history: [], rerender: true, arg: [], index: 0 };
    renderWithContext(contextValue);

    expect(showAlertMock).toHaveBeenCalledWith("error", translations.messageCVNotFound);
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("does not open CV if rerender is false", (): void => {
    const mockCmdArray: string[] = ["cv"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);

    const contextValue: Term = { history: [], rerender: false, arg: [], index: 0 };
    renderWithContext(contextValue);

    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("does not open CV if command is not 'cv'", (): void => {
    const mockCmdArray: string[] = ["ls"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);

    const contextValue: Term = { history: [], rerender: true, arg: [], index: 0 };
    renderWithContext(contextValue);

    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it("renders without crashing", (): void => {
    const mockCmdArray: string[] = ["cv"];
    (getCurrentCmdArry as jest.Mock).mockReturnValue(mockCmdArray);

    const contextValue: Term = { history: [], rerender: true, arg: [], index: 0 };
    const renderResult: RenderResult = renderWithContext(contextValue);

    expect(renderResult.container.firstChild).toBeNull();
  });
});
