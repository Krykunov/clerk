import { useForgotPassword } from "@/hooks/useForgotPassword";

export function ForgotPasswordForm() {
  const {
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
  } = useForgotPassword();

  if (!isLoaded) return null;

  return (
    <div>
      <h1>Forgot Password?</h1>
      <form onSubmit={successfulCreation ? handleResetPassword : handleRequestCode}>
        {!successfulCreation && (
          <>
            <div className="flex flex-col">
              <label>Email</label>
              <input
                type="email"
                placeholder="e.g john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="border border-gray-300 rounded-md p-2 mb-4"
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send password reset code"}
            </button>
            {error && <p>{error}</p>}
          </>
        )}

        {successfulCreation && (
          <>
            <div className="flex flex-col">
              <label>New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border border-gray-300 rounded-md p-2 mb-4"
              />
            </div>
            <div className="flex flex-col">
              <label>Reset code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={isLoading}
                className="border border-gray-300 rounded-md p-2 mb-4"
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset"}
            </button>
            {error && <p>{error}</p>}
          </>
        )}

        {secondFactor && <p>2FA is required. This UI does not yet handle that flow.</p>}
      </form>
    </div>
  );
}
