import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function useLoginForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoaded && isSignedIn) {
      navigate("/account");
    }
  }, [isUserLoaded, isSignedIn, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "janedoe@gmail.com",
      password: "frkH76gFFrddsad",
    },
  });

  const onLogin = async (data: LoginFormValues) => {
    const { email, password } = data;

    if (!isLoaded || !signIn) {
      console.warn("🔁 Clerk not ready for login.");
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // navigate("/account");
        console.log("✅ Login successful");
      } else {
        console.warn("🟡 Login incomplete:", result.status);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Login failed", err.message);
      } else {
        console.error("❌ Login failed", err);
      }
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onLogin),
    isLoading: form.formState.isSubmitting,
  };
}
