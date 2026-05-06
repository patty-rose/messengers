/**
 * Restores Firebase Storage to normal (public read) rules.
 * Run this after resolving the billing issue that caused lockStorage to be used.
 *
 * Usage:
 *   node scripts/unlockStorage.mjs
 */

import { writeFileSync } from "fs";
import { execSync } from "child_process";

const RULES_PATH = "storage.rules";
const NORMAL_RULES = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;

writeFileSync(RULES_PATH, NORMAL_RULES);
console.log("Storage rules restored to public read / authenticated write.");

try {
  execSync("firebase deploy --only storage", { stdio: "inherit" });
  console.log("\nStorage unlocked.");
} catch {
  console.error("\nDeploy failed. Check that you are logged into Firebase CLI (firebase login).");
  process.exit(1);
}
