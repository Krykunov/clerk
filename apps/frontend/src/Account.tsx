import { useUser } from "@clerk/clerk-react";
import { useClerk } from "@clerk/clerk-react";

import { Button } from "./components/ui/button";
import { useNavigate } from "react-router";

function Account() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const logoutHandler = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {!isLoaded && <div>Loading...</div>}
        {!isSignedIn && (
          <div>
            Sign in to view this page <Button onClick={() => navigate("/")}>Back to login</Button>
          </div>
        )}
        {isSignedIn && (
          <div>
            <p>Hello {user.firstName}!</p>
            <p>Id:{user.id}!</p>
            <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
            <Button onClick={logoutHandler}>Log out</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
