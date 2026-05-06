/**
 * Locks Firebase Storage by deploying deny-all security rules.
 * Run this if you receive a billing alert for unexpected Storage charges.
 *
 * Usage:
 *   node scripts/lockStorage.mjs
 *
 * Requires Firebase CLI to be installed and logged in:
 *   npm install -g firebase-tools
 *   firebase login
 */

import { writeFileSync } from "fs";
import { execSync } from "child_process";

const RULES_PATH = "storage.rules";
const LOCKED_RULES = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}`;

writeFileSync(RULES_PATH, LOCKED_RULES);
console.log("Storage rules set to deny all.");

try {
  execSync("firebase deploy --only storage", { stdio: "inherit" });
  console.log("\nStorage locked. Images will not load until you run unlockStorage.mjs.");
} catch {
  console.error("\nDeploy failed. Check that you are logged into Firebase CLI (firebase login).");
  process.exit(1);
}
