import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { req } from "@/lib/api";
import handleAxiosError from "../error";

type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatarUrl?: string;
  role?: string;
  emailVerified?: boolean;
};

type SignInResponse = {
  user: User;
  access: {
    token: string;
    expires: string;
  };
  refresh?: {
    token: string;
    expires: string;
  } | null;
};

type SignInData = {
  email: string;
  password: string;
};

type SignUpData = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

// Query keys for cache management
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  emailStatus: () => [...authKeys.all, "email-status"] as const,
};

// ============================================
// Main hook: Get current user session
// ============================================
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      // Check if token exists first
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      if (!token) {
        return null;
      }

      try {
        // Use your req utility - it returns response.data.data
        const user = await req<User>("/auth/user");
        return user;
      } catch {
        // Token invalid or expired
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
        }
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth failures
    refetchOnWindowFocus: true, // Revalidate when user returns
  });
}

// Derived helper hook for authentication status
export function useAuth() {
  const { data: user, isLoading, isError } = useUser();

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
  };
}

// ============================================
// Sign in mutation
// ============================================
export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: SignInData) => {
      const response = await req.post<SignInResponse, SignInData>(
        "/auth/sign-in",
        credentials,
        "Failed to sign in"
      );
      return response;
    },
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem("authToken", data.access.token);
      if (data.refresh?.token) {
        localStorage.setItem("refreshToken", data.refresh.token);
      }

      // Immediately set user data in cache (optimistic update)
      queryClient.setQueryData(authKeys.user(), data.user);

      // Navigate to dashboard
      router.push("/dashboard");
    },
  });
}

// ============================================
// Sign up mutation
// ============================================
export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (userData: SignUpData) => {
      const response = await req.post<SignInResponse, SignUpData>(
        "/auth/sign-up",
        userData,
        "Failed to sign up"
      );
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.access.token);
      if (data.refresh?.token) {
        localStorage.setItem("refreshToken", data.refresh.token);
      }

      queryClient.setQueryData(authKeys.user(), data.user);

      // You might want to redirect to email verification page
      // if email is not verified
      if (!data.user.emailVerified) {
        router.push("/verify-email");
      } else {
        router.push("/dashboard");
      }
    },
  });
}

// ============================================
// Sign out mutation
// ============================================
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Optional: Call backend logout endpoint if it exists
      try {
        await req.post("/auth/sign-out", undefined, "Logout failed");
      } catch (error) {
        // Continue with client-side logout even if API fails
        handleAxiosError(error);
      }
    },
    onSettled: () => {
      // Always clear tokens and cache, even if API call fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");

      // Clear all cached data
      queryClient.clear();

      // Redirect to signin
      router.push("/signin");
    },
  });
}

// ============================================
// Email verification mutations
// ============================================
export function useSendVerificationEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      return await req.post<{ message: string }, { email: string }>(
        "/auth/email/verify",
        { email },
        "Failed to send verification email"
      );
    },
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      return await req.post<{ message: string }>(
        `/auth/email/verify/${token}`,
        undefined,
        "Failed to verify email"
      );
    },
    onSuccess: () => {
      // Refresh user data to get updated emailVerified status
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
}

export function useEmailStatus() {
  return useQuery({
    queryKey: authKeys.emailStatus(),
    queryFn: async () => {
      return await req<{ verified: boolean }>("/auth/email/status", "get");
    },
    enabled: false, // Only fetch when explicitly called with refetch()
  });
}

// ============================================
// Update user image
// ============================================
export function useUpdateUserImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageUrl: string) => {
      return await req.put<User, { image: string }>(
        "/auth/user/image",
        { image: imageUrl },
        "Failed to update image"
      );
    },
    onMutate: async (newImageUrl) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: authKeys.user() });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(authKeys.user());

      // Optimistically update to new value
      if (previousUser) {
        queryClient.setQueryData<User>(authKeys.user(), {
          ...previousUser,
          avatarUrl: newImageUrl,
        });
      }

      return { previousUser };
    },
    onError: (err, newImageUrl, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(authKeys.user(), context.previousUser);
      }
    },
    onSettled: () => {
      // Refetch to ensure we have correct data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
}
