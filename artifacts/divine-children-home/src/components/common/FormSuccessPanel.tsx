import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface FormSuccessPanelProps {
  title: string;
  message: string;
  referenceNumber?: string | null;
  onReset?: () => void;
}

export function FormSuccessPanel({
  title,
  message,
  referenceNumber,
  onReset,
}: FormSuccessPanelProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-success/30 bg-success/5 p-8 text-center space-y-4"
    >
      <CheckCircle2 className="h-12 w-12 text-success mx-auto" aria-hidden="true" />
      <h3 className="text-xl font-heading font-bold text-primary">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto">{message}</p>
      {referenceNumber && (
        <p className="text-sm font-mono bg-muted px-4 py-2 rounded-md inline-block">
          Reference: <strong>{referenceNumber}</strong>
        </p>
      )}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        {onReset && (
          <Button variant="outline" onClick={onReset}>
            Submit another
          </Button>
        )}
        <Button variant="accent" asChild>
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
