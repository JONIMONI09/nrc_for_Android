import { invoke } from "./bridge-service";
import type { CrashAction } from "../types/crash-analysis";

export type AppliedFix = unknown;

export type ApplyOutcome =
  | { status: "applied"; fix: AppliedFix }
  | { status: "skipped"; reason: string };

export function applyCrashFix(profileId: string, action: CrashAction): Promise<ApplyOutcome> {
  return invoke<ApplyOutcome>("apply_crash_fix", { profileId, action });
}

export function revertCrashFix(applied: AppliedFix): Promise<void> {
  return invoke<void>("revert_crash_fix", { applied });
}
