/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const handleRequestCode = async (e: React.FormEvent) => {
    if (!isLoaded || !signIn) {
      console.warn("🔁 Clerk not ready for login.");
      return;
    }
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn?.create({
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
    setIsLoading(true);

    if (!isLoaded || !signIn) {
      console.warn("🔁 Clerk not ready for login.");
      return;
    }
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (!result) return;

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
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    successfulCreation,
    secondFactor,
    error,
    isLoaded,
    isLoading,
    handleRequestCode,
    handleResetPassword,
  };
}
