/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  code: z.string(),
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

export function useForgotPassword() {
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) {
      console.warn("🔁 Clerk not ready for login.");
      return;
    }

    setIsLoading(true);
    try {
      const email = form.getValues("email");
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      setError("");
    } catch (err: any) {
      console.error("Request error ❌", err.errors?.[0]?.longMessage || err.message);
      setError(err.errors?.[0]?.longMessage || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) {
      console.warn("🔁 Clerk not ready for login.");
      return;
    }

    setIsLoading(true);
    try {
      const { code, password } = form.getValues();

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        setError("");
      } else if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/account");
      }
    } catch (err: any) {
      console.error("Reset error ❌", err.errors?.[0]?.longMessage || err.message);
      setError(err.errors?.[0]?.longMessage || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    successfulCreation,
    secondFactor,
    error,
    isLoaded,
    isLoading,
    handleRequestCode,
    handleResetPassword,
  };
}
