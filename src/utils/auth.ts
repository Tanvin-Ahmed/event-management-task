export function getCurrentUserId(): string | null {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.id;
    }
  }
  return null;
}

export function isUserAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    return storedUser !== null;
  }
  return false;
}
