"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteUserModalProps = {
  userType: "teacher" | "student" | string; // For dynamic label
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void> | void;
  loading?: boolean; // Optional, for showing delete in progress state
};

export function DeleteUserModal({
  userType,
  userName,
  isOpen,
  onClose,
  onConfirmDelete,
  loading = false,
}: DeleteUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle id="delete-dialog-title">
            Delete {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{userName}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
