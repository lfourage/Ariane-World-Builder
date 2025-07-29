export function parseSigninErrors(error: string) {
  const fieldErrors: Record<string, string> = {};

  switch (error) {
    case "CredentialsSignin": {
        fieldErrors["form"] = "Invalid email or password";
        break ;
    }
    case "AccountDisabled": {
        fieldErrors["form"] = "Your account has been disabled";
        break ;
    }
    case "UserAlreadyExistsError": {
      fieldErrors["email"] = "This email is already registered";
    }
    default: {
        fieldErrors["general"] = "Unknown error";
    }
  }
  return fieldErrors;
}
