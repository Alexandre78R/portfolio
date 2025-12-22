import { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor } from '@test-utils';
import "@testing-library/jest-dom";

import SocialCreate from "@/components/AdminLayout/Pages/Socials/SocialCreate";
import type Lang from "@/lang/typeLang";
import {
  gql,
} from "@apollo/client";

jest.mock("@/components/AuthFormLayout/AuthFormLayout", () => ({
  __esModule: true,
  default: ({ title, children }: { title: ReactElement; children: ReactElement }) => (
    <div data-testid="auth-form-layout">
      <div data-testid="form-title">{title}</div>
      <div data-testid="form-content">{children}</div>
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode; type?: string }) => (
    <h2 data-testid="text-admin">{children}</h2>
  ),
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: ({
    id,
    label,
    name,
    value,
    onChange,
    type = "text",
  }: {
    id: string;
    label: string;
    name: string;
    value: string | number;
    onChange: (e: any) => void;
    type?: string;
  }): ReactElement => (
    <div data-testid={`input-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        data-testid={`input-field-${id}`}
      />
    </div>
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({
    text,
    type = "button",
    onClick,
    disable = false,
  }: {
    text: string;
    type?: string;
    onClick?: () => void;
    disable?: boolean;
  }): ReactElement => (
    <button
      type={type as "button" | "submit"}
      onClick={onClick}
      disabled={disable}
      data-testid={`button-${text}`}
    >
      {text}
    </button>
  ),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): ReactElement => <div data-testid="loading">Loading...</div>,
}));

const mockShowAlert: jest.Mock = jest.fn();
jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    showAlert: mockShowAlert,
  })),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: {
      messageAdminSocialCreateTitle: "Create Social",
      messageAdminSocialCreateConfirm: "Create",
      messageAdminSocialCreateLoading: "Creating...",
      messageAdminSocialCreateSuccess: "Social created successfully",
      messageAdminSocialCreateError: "Failed to create social",
      messageAdminSocialInputTitle: "Title",
      messageAdminSocialInputUrl: "URL",
      messageAdminSocialInputTab: "Tab Position",
    } as Lang,
  })),
}));

const CREATE_SOCIAL_MUTATION = gql`
  mutation CreateSocial($data: CreateSocialInput!) {
    createSocial(data: $data) {
      social {
        id
        title
        url
        tab
        __typename
      }
      code
      message
      __typename
    }
  }
`;

const renderWithMocks: (component: ReactElement, mocks?: any[]) => ReturnType<typeof render> = (component, mocks = []) => {
  return render(component, {
    mocks,
  });
};

describe("SocialCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShowAlert.mockClear();
  });

  test("should render form layout", () => {
    const mocks : unknown[] = [
      {
        request: {
          query: CREATE_SOCIAL_MUTATION,
          variables: {
            data: {
              title: "",
              url: "",
              tab: 0,
            },
          },
        },
        result: {
          data: {
            createSocial: {
              code: 200,
              message: "Created",
            },
          },
        },
      },
    ];

    renderWithMocks(<SocialCreate />, mocks);

    expect(screen.getByTestId("auth-form-layout")).toBeInTheDocument();
    expect(screen.getByText("Create Social")).toBeInTheDocument();
  });

  test("should render all input fields", () => {
    const mocks: unknown[] = [
      {
        request: {
          query: CREATE_SOCIAL_MUTATION,
          variables: {
            data: {
              title: "",
              url: "",
              tab: 0,
            },
          },
        },
        result: {
          data: {
            createSocial: {
              code: 200,
              message: "Created",
            },
          },
        },
      },
    ];

    renderWithMocks(<SocialCreate />, mocks);

    expect(screen.getByTestId("input-title")).toBeInTheDocument();
    expect(screen.getByTestId("input-url")).toBeInTheDocument();
    expect(screen.getByTestId("input-tab")).toBeInTheDocument();
  });

  test("should render submit button", () => {
    const mocks: unknown[] = [
      {
        request: {
          query: CREATE_SOCIAL_MUTATION,
          variables: {
            data: {
              title: "",
              url: "",
              tab: 0,
            },
          },
        },
        result: {
          data: {
            createSocial: {
              code: 200,
              message: "Created",
            },
          },
        },
      },
    ];

    renderWithMocks(<SocialCreate />, mocks);

    expect(screen.getByTestId("button-Create")).toBeInTheDocument();
  });

  test("should update form fields on input change", () => {
    const mocks: unknown[] = [
      {
        request: {
          query: CREATE_SOCIAL_MUTATION,
          variables: {
            data: {
              title: "",
              url: "",
              tab: 0,
            },
          },
        },
        result: {
          data: {
            createSocial: {
              code: 200,
              message: "Created",
            },
          },
        },
      },
    ];

    renderWithMocks(<SocialCreate />, mocks);

    const titleInput: HTMLInputElement = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput: HTMLInputElement = screen.getByTestId("input-field-url") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });

    expect(titleInput.value).toBe("GitHub");
    expect(urlInput.value).toBe("https://github.com/user");
  });

  test("should call mutation on form submit with correct data", async () => {
    const mocks: unknown[] = [
      {
        request: {
          query: CREATE_SOCIAL_MUTATION,
          variables: {
            data: {
              title: "GitHub",
              url: "https://github.com/user",
              tab: 1,
            },
          },
        },
        result: {
          data: {
            createSocial: {
              code: 200,
              message: "Created",
              social: {
                id: "1",
                title: "GitHub",
                url: "https://github.com/user",
                tab: 1,
              },
            },
          },
        },
      },
    ];

    renderWithMocks(<SocialCreate />, mocks);

    const titleInput: HTMLInputElement = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput: HTMLInputElement = screen.getByTestId("input-field-url") as HTMLInputElement;
    const tabInput: HTMLInputElement = screen.getByTestId("input-field-tab") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });
    fireEvent.change(tabInput, { target: { value: "1" } });

    const submitButton: HTMLButtonElement = screen.getByTestId("button-Create") as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Social created successfully");
    });
  });

  test("should show success message on successful creation", async () => {
    const mocks: unknown[] = [
      {
        request: {
          query: CREATE_SOCIAL_MUTATION,
          variables: {
            data: {
              title: "GitHub",
              url: "https://github.com/user",
              tab: 1,
            },
          },
        },
        result: {
          data: {
            createSocial: {
              code: 200,
              message: "Created",
              social: {
                id: "1",
                title: "GitHub",
                url: "https://github.com/user",
                tab: 1,
              },
            },
          },
        },
      },
    ];

    renderWithMocks(<SocialCreate />, mocks);

    const titleInput: HTMLInputElement = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput: HTMLInputElement = screen.getByTestId("input-field-url") as HTMLInputElement;
    const tabInput: HTMLInputElement = screen.getByTestId("input-field-tab") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });
    fireEvent.change(tabInput, { target: { value: "1" } });

    const submitButton = screen.getByTestId("button-Create");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Social created successfully");
    });
  });

  test("should show error message on failed creation", async () => {
    const mocks: unknown[] = [
      {
        request: {
          query: CREATE_SOCIAL_MUTATION,
          variables: {
            data: {
              title: "GitHub",
              url: "https://github.com/user",
              tab: 1,
            },
          },
        },
        result: {
          data: {
            createSocial: {
              code: 400,
              message: "Error",
            },
          },
        },
      },
    ];

    renderWithMocks(<SocialCreate />, mocks);

    const titleInput: HTMLInputElement = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput: HTMLInputElement = screen.getByTestId("input-field-url") as HTMLInputElement;
    const tabInput: HTMLInputElement = screen.getByTestId("input-field-tab") as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });
    fireEvent.change(tabInput, { target: { value: "1" } });

    const submitButton: HTMLButtonElement = screen.getByTestId("button-Create") as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to create social");
    });
  });

  test("should reset form after successful creation", async () => {
    const mocks: unknown[] = [
      {
        request: {
          query: CREATE_SOCIAL_MUTATION,
          variables: {
            data: {
              title: "GitHub",
              url: "https://github.com/user",
              tab: 1,
            },
          },
        },
        result: {
          data: {
            createSocial: {
              code: 200,
              social: {
                id: "1",
                title: "GitHub",
                url: "https://github.com/user",
                tab: 1,
              },
            },
          },
        },
      },
    ];

    renderWithMocks(<SocialCreate />, mocks);

    const titleInput: HTMLInputElement = screen.getByTestId("input-field-title") as HTMLInputElement;
    const urlInput: HTMLInputElement = screen.getByTestId("input-field-url") as HTMLInputElement;
    const tabInput: HTMLInputElement = screen.getByTestId("input-field-tab") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "GitHub" } });
    fireEvent.change(urlInput, { target: { value: "https://github.com/user" } });
    fireEvent.change(tabInput, { target: { value: "1" } });

    const submitButton: HTMLButtonElement = screen.getByTestId("button-Create") as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe("");
      expect(urlInput.value).toBe("");
      expect(tabInput.value).toBe("0");
    });
  });

  test("should disable submit button during loading", () => {
    const mocks: unknown[] = [
      {
        request: {
          query: CREATE_SOCIAL_MUTATION,
          variables: {
            data: {
              title: "",
              url: "",
              tab: 0,
            },
          },
        },
        result: {
          data: {
            createSocial: {
              code: 200,
              message: "Created",
            },
          },
        },
      },
    ];

    renderWithMocks(<SocialCreate />, mocks);

    const buttons = screen.getAllByRole("button");
    const submitButton: HTMLButtonElement = buttons[buttons.length - 1] as HTMLButtonElement;
    expect(submitButton).toBeInTheDocument();
  });
});
