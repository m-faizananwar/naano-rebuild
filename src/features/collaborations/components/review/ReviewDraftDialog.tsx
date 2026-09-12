"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type CollaborationDto, type ReviewFormInput, reviewFormSchema } from "../../schemas";
import { COPY } from "../../ui-constants";

type Props = {
  collaboration: CollaborationDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
  onSubmit: (values: ReviewFormInput) => Promise<boolean>;
};

const NOTE_ROWS = 4;

// "Review LinkedIn post": the full draft, then approve or send it back with a
// required comment. Request changes is capped by MAX_REVISION_ROUNDS.
export function ReviewDraftDialog({ collaboration: c, open, onOpenChange, disabled, onSubmit }: Props) {
  const [changing, setChanging] = useState(false);
  const form = useForm<ReviewFormInput>({ resolver: zodResolver(reviewFormSchema), defaultValues: { decision: "approve", note: "" } });
  const { errors, isSubmitting } = form.formState;
  const capReached = c.revisionRound >= c.maxRevisionRounds;
  const roundLabel = `Round ${Math.min(c.revisionRound + 1, c.maxRevisionRounds)} of ${c.maxRevisionRounds}`;

  async function submit(decision: ReviewFormInput["decision"]) {
    form.setValue("decision", decision);
    await form.handleSubmit(async (values) => {
      const ok = await onSubmit(values);
      if (ok) {
        onOpenChange(false);
        setChanging(false);
        form.reset();
      }
    })();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{COPY.reviewTitle}</DialogTitle>
          <DialogDescription>{COPY.reviewDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {c.creatorName} · {c.campaignName}
          </span>
          <span>{roundLabel}</span>
        </div>
        <article className="max-h-80 overflow-y-auto rounded-xl border bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-line">
          {c.draftText ?? "No draft text was attached."}
        </article>
        {changing ? (
          <form className="grid gap-1.5" onSubmit={(e) => e.preventDefault()} noValidate>
            <Label htmlFor="reviewNote">What should change?</Label>
            <Textarea
              id="reviewNote"
              rows={NOTE_ROWS}
              autoFocus
              aria-invalid={Boolean(errors.note)}
              placeholder="Be concrete: what to keep, what to move, what to cut."
              {...form.register("note")}
            />
            {errors.note ? <p className="text-xs text-destructive">{errors.note.message}</p> : null}
          </form>
        ) : capReached ? (
          <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            {c.maxRevisionRounds} revision rounds have been used — this draft can only be approved. Talk it through in Messages if
            something is still off.
          </p>
        ) : null}
        <DialogFooter>
          {changing ? (
            <>
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setChanging(false)}>
                Back
              </Button>
              <Button type="button" disabled={disabled || isSubmitting} onClick={() => submit("request_changes")}>
                {isSubmitting ? "Sending…" : "Send the changes"}
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" disabled={disabled || capReached} onClick={() => setChanging(true)}>
                Request changes
              </Button>
              <Button
                type="button"
                disabled={disabled || isSubmitting}
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={() => submit("approve")}
              >
                {isSubmitting ? "Approving…" : "Approve"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
