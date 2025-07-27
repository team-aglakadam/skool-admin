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

export async function getTeachers(schoolId: string | null) {
  console.log("schoolId1", schoolId);
  const res = await fetch(`/api/teachers?schoolId=${schoolId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // This ensures cookies are sent with the request
  });
  if (!res.ok) throw new Error("Failed to fetch teachers");
  return res.json();
}

export async function addTeacher(payload: any) {
  const res = await fetch("/api/teachers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // For auth cookies
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to add teacher");
  }
  return res.json();
}
