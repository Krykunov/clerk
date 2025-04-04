import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const formSchema = z.object({
  firstname: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type SignupFormValues = z.infer<typeof formSchema>;

export function useSignupForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoaded && isSignedIn) {
      navigate("/account");
    }
  }, [isUserLoaded, isSignedIn, navigate]);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "Jane",
      lastname: "Doe",
      email: "janedoe@gmail.com",
      password: "frkH76gFFrddsad",
    },
  });

  const onSignup = async (data: SignupFormValues) => {
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let message = "Unknown error";
        try {
          const error = await res.json();
          message = error.error;
        } catch {
          message = `Server responded with status ${res.status}`;
        }
        console.log("Signup failed: " + message);
        return;
      }

      const { message, signInToken } = await res.json();
      console.log(message, signInToken);

      if (!isLoaded || !signIn) {
        console.warn("🔁 Clerk not ready for sign-in.");
        return;
      }

      try {
        const result = await signIn.create({
          strategy: "ticket",
          ticket: signInToken,
        });
        await setActive({ session: result.createdSessionId });
        // navigate("/account");
        console.log("✅ User signed in successfully");
      } catch (err) {
        console.error("❌ Failed to sign in with token", err);
      }
    } catch (err) {
      console.error("Network error ❌", err);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSignup),
    isLoading: form.formState.isSubmitting,
  };
}
