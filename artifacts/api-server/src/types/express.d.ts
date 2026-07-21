import type { AdminProfile } from "@workspace/supabase";

declare global {
  namespace Express {
    interface Request {
      admin?: AdminProfile;
    }
  }
}

export {};
