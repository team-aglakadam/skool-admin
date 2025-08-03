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

export async function addTeacher(payload: CreateTeacherData) {
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

import { Teacher } from '../types/teacher';
import { CreateClassData, UpdateClassData } from '@/contexts/ClassesContext';

export type CreateTeacherData = Omit<Teacher, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
export type UpdateTeacherData = Partial<Omit<Teacher, 'id' | 'createdAt' | 'updatedAt' | 'status'>>;

export async function updateTeacher(id: string, updates: UpdateTeacherData) {
  const response = await fetch('/api/teachers', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...updates }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update teacher');
  }

  return response.json();
}

export async function deleteTeacher(id: string) {
  const res = await fetch(`/api/teachers/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete teacher');
  }

  return res.json();
}

// Classes API helpers
export async function getClasses(schoolId: string | null) {
  const res = await fetch(`/api/classes?school_id=${schoolId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch classes');
  return res.json();
}

export async function addClass(payload: CreateClassData) {
  const res = await fetch('/api/classes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add class');
  }
  return res.json();
}

export async function updateClass(id: string, updates: UpdateClassData) {
  const res = await fetch(`/api/classes`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ ...updates, id }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update class');
  }

  return res.json();
}

export async function deleteClass(id: string) {
  const res = await fetch(`/api/classes?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete class');
  }

  return res.json();
}
