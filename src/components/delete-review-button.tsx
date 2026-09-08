"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteReview } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function DeleteReviewButton({
  campgroundId,
  reviewId,
}: {
  campgroundId: string;
  reviewId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteReview(campgroundId, reviewId);
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Delete review"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
      <ConfirmDialog
        open={open}
        title="Delete this review?"
        description="This can't be undone."
        confirmLabel="Delete"
        pending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
