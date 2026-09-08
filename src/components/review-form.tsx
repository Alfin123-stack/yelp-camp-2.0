"use client";

import { useActionState } from "react";
import { addReview, type ReviewFormState } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarInput } from "@/components/star-rating";

const initialState: ReviewFormState = {};

export default function ReviewForm({ campgroundId }: { campgroundId: string }) {
  const action = addReview.bind(null, campgroundId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-forest-100 bg-white p-6 shadow-sm shadow-forest-900/5"
    >
      <h3 className="font-serif text-lg font-medium text-forest-950">Tulis ulasan</h3>

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <Label>Rating</Label>
        <StarInput name="rating" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Ulasan</Label>
        <Textarea id="body" name="body" required placeholder="Bagaimana pengalamanmu di sini?" />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold-300 text-forest-950 hover:bg-gold-200"
      >
        {pending ? "Mengirim..." : "Kirim ulasan"}
      </Button>
    </form>
  );
}