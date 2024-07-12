import { createContext } from "react";

const AuthContext = createContext({
  isLoading: true,
  isOnboardingCompleted: false,
  avatarInitials: '',
  avatarUri: ''
});

export default AuthContext