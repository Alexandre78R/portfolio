import { renderHook, act } from '@testing-library/react';
import { useMutation } from '@apollo/client';
import { useLogin, useLogout, useChangePassword, useForgotPassword } from '@/utils/hooks/useAuthHooks';
import { LOGIN, LOGOUT } from '@/requetes/mutations/login.mutations';
import { CHANGE_PASSWORD, FORGOT_PASSWORD } from '@/requetes/mutations/user.mutations';

jest.mock('@apollo/client');

describe('useAuthHooks', (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe('useLogin', (): void => {
    it('should return login function and loading state', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      const { result } = renderHook(() => useLogin());
      const [loginFn, { loading, error }] = result.current;

      expect(loginFn).toBeDefined();
      expect(typeof loginFn).toBe('function');
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
    });

    it('should call useMutation with LOGIN mutation', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      renderHook(() => useLogin());

      expect(useMutation).toHaveBeenCalledWith(LOGIN);
    });

    it('should return loading state when mutation is loading', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: true, error: undefined },
      ]);

      const { result } = renderHook(() => useLogin());
      const [, { loading }] = result.current;

      expect(loading).toBe(true);
    });

    it('should pass variables correctly to login mutation', async (): Promise<void> => {
      const mockMutationFn = jest.fn().mockResolvedValue({
        data: { login: { code: 200, message: 'Success', token: 'test-token' } },
      });

      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      const { result } = renderHook(() => useLogin());
      const [loginFn] = result.current;

      const variables = { email: 'test@example.com', password: 'password123' };

      await act(async (): Promise<void> => {
        await loginFn(variables);
      });

      expect(mockMutationFn).toHaveBeenCalledWith({ variables });
    });
  });

  describe('useLogout', (): void => {
    it('should return logout function and loading state', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      const { result } = renderHook(() => useLogout());
      const [logoutFn, { loading, error }] = result.current;

      expect(logoutFn).toBeDefined();
      expect(typeof logoutFn).toBe('function');
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
    });

    it('should call useMutation with LOGOUT mutation', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      renderHook(() => useLogout());

      expect(useMutation).toHaveBeenCalledWith(LOGOUT);
    });

    it('should call logout without variables', async (): Promise<void> => {
      const mockMutationFn = jest.fn().mockResolvedValue({
        data: { logout: { code: 200, message: 'Success' } },
      });

      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      const { result } = renderHook(() => useLogout());
      const [logoutFn] = result.current;

      await act(async (): Promise<void> => {
        await logoutFn();
      });

      expect(mockMutationFn).toHaveBeenCalled();
    });
  });

  describe('useChangePassword', (): void => {
    it('should return changePassword function and loading state', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      const { result } = renderHook(() => useChangePassword());
      const [changePasswordFn, { loading, error }] = result.current;

      expect(changePasswordFn).toBeDefined();
      expect(typeof changePasswordFn).toBe('function');
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
    });

    it('should call useMutation with CHANGE_PASSWORD mutation', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      renderHook(() => useChangePassword());

      expect(useMutation).toHaveBeenCalledWith(CHANGE_PASSWORD);
    });

    it('should pass variables correctly to changePassword mutation', async (): Promise<void> => {
      const mockMutationFn = jest.fn().mockResolvedValue({
        data: { changePassword: { code: 200, message: 'Success' } },
      });

      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      const { result } = renderHook(() => useChangePassword());
      const [changePasswordFn] = result.current;

      const variables = { email: 'test@example.com', newPassword: 'newPassword123' };

      await act(async (): Promise<void> => {
        await changePasswordFn(variables);
      });

      expect(mockMutationFn).toHaveBeenCalledWith({ variables });
    });
  });

  describe('useForgotPassword', (): void => {
    it('should return forgotPassword function and loading state', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      const { result } = renderHook(() => useForgotPassword());
      const [forgotPasswordFn, { loading, error }] = result.current;

      expect(forgotPasswordFn).toBeDefined();
      expect(typeof forgotPasswordFn).toBe('function');
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
    });

    it('should call useMutation with FORGOT_PASSWORD mutation', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      renderHook(() => useForgotPassword());

      expect(useMutation).toHaveBeenCalledWith(FORGOT_PASSWORD);
    });

    it('should pass variables correctly to forgotPassword mutation', async (): Promise<void> => {
      const mockMutationFn = jest.fn().mockResolvedValue({
        data: { forgotPassword: { code: 200, message: 'Success' } },
      });

      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: false, error: undefined },
      ]);

      const { result } = renderHook(() => useForgotPassword());
      const [forgotPasswordFn] = result.current;

      const variables = { email: 'test@example.com', lang: 'fr' as const };

      await act(async (): Promise<void> => {
        await forgotPasswordFn(variables);
      });

      expect(mockMutationFn).toHaveBeenCalledWith({ variables });
    });

    it('should return error state when mutation fails', (): void => {
      const mockError = new Error('Mutation failed');
      (useMutation as jest.Mock).mockReturnValue([
        jest.fn(),
        { loading: false, error: mockError },
      ]);

      const { result } = renderHook(() => useForgotPassword());
      const [, { error }] = result.current;

      expect(error).toEqual(mockError);
    });
  });

  describe('Error handling', (): void => {
    it('should handle mutation errors in login', (): void => {
      const mockError = new Error('Network error');
      (useMutation as jest.Mock).mockReturnValue([
        jest.fn(),
        { loading: false, error: mockError },
      ]);

      const { result } = renderHook(() => useLogin());
      const [, { error }] = result.current;

      expect(error).toEqual(mockError);
    });

    it('should handle mutation errors in logout', (): void => {
      const mockError = new Error('Logout failed');
      (useMutation as jest.Mock).mockReturnValue([
        jest.fn(),
        { loading: false, error: mockError },
      ]);

      const { result } = renderHook(() => useLogout());
      const [, { error }] = result.current;

      expect(error).toEqual(mockError);
    });

    it('should handle mutation errors in changePassword', (): void => {
      const mockError = new Error('Password change failed');
      (useMutation as jest.Mock).mockReturnValue([
        jest.fn(),
        { loading: false, error: mockError },
      ]);

      const { result } = renderHook(() => useChangePassword());
      const [, { error }] = result.current;

      expect(error).toEqual(mockError);
    });
  });

  describe('Loading states', (): void => {
    it('should track loading state for login', (): void => {
      const mockMutationFn = jest.fn();
      const { rerender } = renderHook(
        ({ loading }: { loading: boolean }) => {
          (useMutation as jest.Mock).mockReturnValue([
            mockMutationFn,
            { loading, error: undefined },
          ]);
          return useLogin();
        },
        { initialProps: { loading: false } }
      );

      let { result } = renderHook(() => useLogin());
      expect(result.current[1].loading).toBe(false);

      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: true, error: undefined },
      ]);

      ({ result } = renderHook(() => useLogin()));
      expect(result.current[1].loading).toBe(true);
    });

    it('should track loading state for changePassword', (): void => {
      const mockMutationFn = jest.fn();
      (useMutation as jest.Mock).mockReturnValue([
        mockMutationFn,
        { loading: true, error: undefined },
      ]);

      const { result } = renderHook(() => useChangePassword());
      expect(result.current[1].loading).toBe(true);
    });
  });
});
