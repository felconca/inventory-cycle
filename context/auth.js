import { useRouter, useSegments } from "expo-router";
import React from "react";

const AuthContext = React.createContext({
  signIn: () => {},
  signOut: () => {},
  user: null,
});

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    console.log({ user, segments });
    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/login");
    } else if (user && (inAuthGroup || segments[0] === "[...404]")) {
      // Redirect away from the sign-in page.
      router.replace("/main/receiving");
    }
  }, [user, segments]);
}

export const Provider = (props) => {
  const [user, setAuth] = React.useState(props.userCredentials);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: (userCredentials) => setAuth(userCredentials),
        signOut: () => setAuth(null),
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
