export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Email already registered: ${email}`);
    this.name = "UserAlreadyExistsError";
  }
}
