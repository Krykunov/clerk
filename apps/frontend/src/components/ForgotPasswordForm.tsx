import { useForgotPassword } from "@/hooks/useForgotPassword";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router";

export function ForgotPasswordForm() {
  const { form, successfulCreation, secondFactor, error, isLoaded, isLoading, handleRequestCode, handleResetPassword } =
    useForgotPassword();

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>

          <Link className="text-blue-400 text-sm" to="/login">
            Back to login
          </Link>

          <CardDescription>
            {!successfulCreation
              ? "Enter your email to receive a password reset code"
              : "Enter the code sent to your email and your new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={successfulCreation ? handleResetPassword : handleRequestCode} className="space-y-4">
              {!successfulCreation && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g john@doe.com" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {successfulCreation && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reset Code</FormLabel>
                        <FormControl>
                          <Input type="text" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? successfulCreation
                    ? "Resetting..."
                    : "Sending..."
                  : successfulCreation
                  ? "Reset Password"
                  : "Send Reset Code"}
              </Button>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {secondFactor && (
                <p className="text-amber-500 text-sm mt-2">2FA is required. This UI does not yet handle that flow.</p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
