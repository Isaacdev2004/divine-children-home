import type { PostgrestError } from "@supabase/supabase-js";

export class DatabaseError extends Error {
  readonly name = "DatabaseError";
  readonly code?: string;

  constructor(message: string, error?: PostgrestError) {
    super(message);
    this.code = error?.code;
  }
}

export function assertNoError(error: PostgrestError | null): void {
  if (error) {
    throw new DatabaseError(error.message, error);
  }
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof DatabaseError &&
    (error.code === "23505" || error.message.includes("duplicate"))
  );
}
