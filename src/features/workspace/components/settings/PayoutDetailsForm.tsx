"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type PayoutDetailsInput, payoutDetailsSchema } from "../../schemas";
import { updatePayoutDetails } from "../../server/actions";

type Props = { defaults: { method: "stripe" | "bank" | null; accountHolder: string; ibanLast4: string } };

// Settings › Payments. No Stripe Connect or bank rail behind it: the method
// decides whether a withdrawal settles instantly (Stripe) or sits "in
// transit" (bank), and only the IBAN's last 4 characters are stored.
export function PayoutDetailsForm({ defaults }: Props) {
  const router = useRouter();
  const form = useForm<PayoutDetailsInput>({
    resolver: zodResolver(payoutDetailsSchema),
    defaultValues: { method: defaults.method ?? "stripe", accountHolder: defaults.accountHolder, iban: "" },
  });
  const { errors, isSubmitting } = form.formState;
  const method = form.watch("method");

  async function onSubmit(values: PayoutDetailsInput) {
    const result = await updatePayoutDetails(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Payout details saved");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <fieldset className="grid gap-2">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payout method</legend>
        {(
          [
            { key: "stripe", title: "Stripe", body: "Instant transfer to a connected Stripe account (demo rail — no Stripe Connect in this build)." },
            { key: "bank", title: "Bank transfer", body: "SEPA transfer. International transfers usually arrive within 1–7 days; withdrawals show as “In transit”." },
          ] as const
        ).map((m) => (
          <label key={m.key} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-[:checked]:border-brand has-[:checked]:bg-brand/5">
            <input type="radio" value={m.key} {...form.register("method")} className="mt-1 accent-brand" />
            <span>
              <span className="block font-medium">{m.title}</span>
              <span className="block text-xs text-muted-foreground">{m.body}</span>
            </span>
          </label>
        ))}
      </fieldset>
      {method === "bank" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="accountHolder">Account holder</Label>
            <Input id="accountHolder" {...form.register("accountHolder")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="iban">IBAN</Label>
            <Input id="iban" placeholder={defaults.ibanLast4 ? `•••• ${defaults.ibanLast4} (on file)` : "FR76 …"} autoComplete="off" {...form.register("iban")} />
            {errors.iban ? <p className="text-sm text-destructive">{errors.iban.message}</p> : null}
            <p className="text-xs text-muted-foreground">Only the last 4 characters are stored.</p>
          </div>
        </div>
      ) : null}
      <div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save payout details"}</Button>
      </div>
    </form>
  );
}
