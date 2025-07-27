export async function signInUser(payload: { email: string; password: string }) {
  const res = await fetch("/api/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Something went wrong");
  }

  return res.json();
}

export async function signOutUser() {
  const res = await fetch("/api/auth/sign-out", {
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Logout failed");
  }

  return res.json();
}
