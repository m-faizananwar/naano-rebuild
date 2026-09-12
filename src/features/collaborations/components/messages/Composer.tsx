"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type MessageFormInput, messageFormSchema } from "../../schemas";
import { COPY } from "../../ui-constants";
import { QuickReactions } from "./QuickReactions";

type Props = { disabled: boolean; onSend: (values: MessageFormInput) => void };

export function Composer({ disabled, onSend }: Props) {
  const form = useForm<MessageFormInput>({ resolver: zodResolver(messageFormSchema), defaultValues: { body: "" } });
  const { errors } = form.formState;

  const submit = form.handleSubmit((values) => {
    onSend(values);
    form.reset();
  });

  return (
    <form onSubmit={submit} className="space-y-2 border-t p-3" noValidate>
      <QuickReactions onPick={(emoji) => form.setValue("body", `${form.getValues("body")}${emoji}`, { shouldValidate: false })} />
      <div className="flex items-end gap-2">
        <label className="sr-only" htmlFor="message-body">
          Message
        </label>
        <Textarea
          id="message-body"
          rows={1}
          placeholder={COPY.composerPlaceholder}
          aria-invalid={Boolean(errors.body)}
          className="min-h-10 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          {...form.register("body")}
        />
        <Button type="submit" size="icon-lg" aria-label="Send" disabled={disabled} className="shrink-0 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <SendHorizontal aria-hidden="true" />
        </Button>
      </div>
      {errors.body ? <p className="text-xs text-destructive">{errors.body.message}</p> : null}
    </form>
  );
}
