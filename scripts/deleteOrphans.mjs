/**
 * Deletes confirmed orphaned files from Firebase Storage.
 *
 * These files are not referenced by any page in Firestore.
 * Where a file was the ONLY copy (no referenced version exists),
 * one copy has been kept for recovery. Only true duplicates are deleted.
 *
 * Run:
 *   gcloud auth application-default login
 *   node scripts/deleteOrphans.mjs
 */

import { initializeApp, cert, getApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

initializeApp({ storageBucket: "messengers-of-lahar.appspot.com" });

const bucket = getStorage().bucket();

// Files safe to delete: either a referenced copy exists, or multiple orphaned
// copies exist and we're keeping one. Single-copy orphans are NOT in this list.
const toDelete = [
  // IMG_20201118: 1 orphan — referenced copy exists
  "IMG_20201118_195052361.jpg8501d0a0-0bd6-487c-922c-8bd075bc1ced",

  // IMG_20201210: 1 orphan — referenced copy exists
  "IMG_20201210_114211360_HDR~2.jpg27fd2859-2581-497b-a29c-770cbb7bd23a",

  // IMG_20201227: 8 orphans — referenced copy exists
  "IMG_20201227_122630109_HDR.jpg0c6f4bd9-8ad1-40fe-a513-5da96a80daa4",
  "IMG_20201227_122630109_HDR.jpg3866db4e-e2bb-44e0-b678-df752e6e4e7e",
  "IMG_20201227_122630109_HDR.jpg3f0bf136-f1ea-403e-b203-5099e728e4eb",
  "IMG_20201227_122630109_HDR.jpg48eff458-7c50-46b3-88c4-c848fbd76790",
  "IMG_20201227_122630109_HDR.jpgbf8246e5-8ebb-474f-bc40-c0e403070576",
  "IMG_20201227_122630109_HDR.jpgc1a37b57-f818-40a4-99be-36b3158d0158",
  "IMG_20201227_122630109_HDR.jpgd1c0c693-b349-4bb9-9cf6-642f41be45dc",
  "IMG_20201227_122630109_HDR.jpgee7d0e69-b7b2-40cd-a48c-ab1acdff6212",

  // IMG_20210117: 3 uncompressed orphans — compressed referenced copy exists
  "IMG_20210117_131715592_HDR.jpg46c62ef1-6bd5-4ce4-95fe-b4aa44881edd",
  "IMG_20210117_131715592_HDR.jpg9cde38e8-d2f6-4333-9861-136194805cda",
  "IMG_20210117_131715592_HDR.jpga280ff1d-6595-4c4f-9cc6-25a4f88f5e59",

  // IMG_20230605: 2 orphans — keeping 0b0e370a, deleting duplicate
  "IMG_20230605_025523174~2.jpgca6a514e-f128-4cfc-840b-066924015614",

  // IMG_20230608_090937: 2 orphans — keeping 1da9ee32, deleting duplicate
  "IMG_20230608_090937992.jpg6bde5b6f-d3d1-421f-8b88-0f4a8f108db3",

  // IMG_20230614 ~4: 1 orphan — other ~4 copy is referenced
  "IMG_20230614_190658852_HDR~4.jpgfc7cff8b-5a9b-4caa-bb8f-993a8e5f2433",

  // IMG_2911: 13 orphans — referenced copy (32563c55) exists
  "IMG_2911.JPG214a77c9-ab84-45b0-ad95-7356637892ce",
  "IMG_2911.JPG24b59031-4d29-486f-b8da-0501b50c75e7",
  "IMG_2911.JPG3ca53c50-c489-4db6-b6a5-4faa0b5640bb",
  "IMG_2911.JPG41271ce3-68c2-4303-8c8e-c9ab33590020",
  "IMG_2911.JPG413e963a-c699-4e9a-8c5d-c551f1dfbff2",
  "IMG_2911.JPG787c976f-6df6-4a70-bd00-56a1df155e52",
  "IMG_2911.JPG87bcb29c-f9eb-4797-adb7-3b779ed0d315",
  "IMG_2911.JPG9d542372-cb92-4292-a2f4-995b39596f8d",
  "IMG_2911.JPGa4565b31-73a7-40c8-ae05-6568e3aecf70",
  "IMG_2911.JPGbd8fdf35-8df5-4ee0-8c6c-e17da61ed513",
  "IMG_2911.JPGc265d2fb-ebc8-41d8-9775-8fc5fc899b41",
  "IMG_2911.JPGd80669f9-4fc3-44a9-9bb7-4bf0da48f1cd",
  "IMG_2911.JPGe9220247-e330-40cb-ab43-e4f3292cde0e",

  // IMG_2944: 4 orphans — keeping 0f2025b5, deleting 3 duplicates
  "IMG_2944.JPG5c65c3a9-0431-4b9b-bbf7-d32cc714ea4a",
  "IMG_2944.JPG7c2d4a6d-64b0-4bb3-b69d-be10ebb7aa9e",
  "IMG_2944.JPGd60690a6-ae36-4a10-9812-501745b4f4db",

  // IMG_2964: 4 orphans — keeping 43bf4e38, deleting 3 duplicates
  "IMG_2964.JPG78df3a74-df65-4f65-ac8f-460dc763141a",
  "IMG_2964.JPGaf019d41-c781-4aca-9322-63704f4738c2",
  "IMG_2964.JPGfa2f32a8-7d30-4a42-8989-d9fc86f9d47c",

  // IMG_4693: 4 orphans — referenced copy (03ee53eb) exists
  "IMG_4693.jpeg66a8227b-27b4-44af-99eb-c9404299b0c0",
  "IMG_4693.jpeg6f9aabd9-a6c3-40e0-8e66-abd2a0dd8fd0",
  "IMG_4693.jpegb6b34806-1bb1-410a-aae6-f5a166beeb23",
  "IMG_4693.jpegf9f80638-579b-42e3-a0a6-164b469237d9",

  // IMG_4815: 2 orphans — referenced copy (0576d79b) exists
  "IMG_4815.jpeg13e0a362-e1f9-46b5-a18f-893e8512f247",
  "IMG_4815.jpegbc1697c2-95af-47b9-8bd0-2aa781712add",

  // kidpix (first file): 1 orphan — referenced copy (b5d505fa) exists
  "kidpix-1747101760882.png98cf2f5f-0dff-464e-ab7c-1b2299e86819",

  // ochrebeach: 1 orphan — referenced copy (6ba53e18) exists
  "ochrebeach.jpg4c1b7665-b2c6-420e-8d30-c2b5c55f84a8",
];

// Files intentionally kept (single orphans with no referenced copy to fall back on):
// IMG_1949.jpeg4f02169a, IMG_20230608_132531022_HDR.jpg26bfaa3c,
// IMG_20230614_190658852_HDR~3.jpg66121ba4, IMG_20230605_025523174~2.jpg0b0e370a,
// IMG_20230608_090937992.jpg1da9ee32, IMG_2697.JPG692ffc24,
// IMG_2700.JPG556195ce, IMG_2944.JPG0f2025b5, IMG_2964.JPG43bf4e38,
// IMG_3102.JPGe6ba3b24, kidpix-1747115858723.pngff781826,
// output-onlinepngtools.png1475502c

let deleted = 0;
let failed = 0;

console.log(`Deleting ${toDelete.length} orphaned files...\n`);

for (const filename of toDelete) {
  try {
    await bucket.file(filename).delete();
    console.log(`✓  ${filename}`);
    deleted++;
  } catch (err) {
    console.error(`✗  ${filename}\n   ${err.message}`);
    failed++;
  }
}

console.log(`\nDone. ${deleted} deleted, ${failed} failed.`);
