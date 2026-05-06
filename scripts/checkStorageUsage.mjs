/**
 * Queries Google Cloud Monitoring for Firebase Storage egress (download bytes)
 * in the last 24 hours. Exits with code 1 if usage exceeds the threshold,
 * which signals the GitHub Actions workflow to lock storage.
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS or CLOUDSDK_AUTH_ACCESS_TOKEN in env.
 */

const PROJECT_ID = "messengers-of-lahar";
const BUCKET = "messengers-of-lahar.appspot.com";
const FREE_TIER_BYTES = 1_073_741_824; // 1 GB
const THRESHOLD = 0.85; // lock at 85% of free tier (~870 MB)
const LOCK_AT_BYTES = Math.floor(FREE_TIER_BYTES * THRESHOLD);

// GitHub Actions sets CLOUDSDK_AUTH_ACCESS_TOKEN after google-github-actions/auth
const token = process.env.CLOUDSDK_AUTH_ACCESS_TOKEN || process.env.GCLOUD_ACCESS_TOKEN;

if (!token) {
  console.error("No Google auth token found. Set CLOUDSDK_AUTH_ACCESS_TOKEN.");
  process.exit(2);
}

const now = new Date();
const start = new Date(now - 24 * 60 * 60 * 1000);

const params = new URLSearchParams({
  "filter": `metric.type="storage.googleapis.com/network/sent_bytes_count" AND resource.labels.bucket_name="${BUCKET}"`,
  "interval.startTime": start.toISOString(),
  "interval.endTime": now.toISOString(),
  "aggregation.alignmentPeriod": "86400s",
  "aggregation.perSeriesAligner": "ALIGN_SUM",
  "aggregation.crossSeriesReducer": "REDUCE_SUM",
  "aggregation.groupByFields": "resource.labels.bucket_name",
});

const url = `https://monitoring.googleapis.com/v3/projects/${PROJECT_ID}/timeSeries?${params}`;

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` },
});

if (!res.ok) {
  console.error(`Monitoring API error: ${res.status} ${await res.text()}`);
  process.exit(2);
}

const data = await res.json();
const series = data.timeSeries?.[0];
const bytes = series ? Number(series.points?.[0]?.value?.int64Value ?? 0) : 0;
const mb = (bytes / 1_048_576).toFixed(1);
const pct = ((bytes / FREE_TIER_BYTES) * 100).toFixed(1);

console.log(`Storage egress last 24h: ${mb} MB (${pct}% of free tier)`);

if (bytes >= LOCK_AT_BYTES) {
  console.log(`Threshold exceeded (${THRESHOLD * 100}%). Signalling lock.`);
  process.exit(1);
}

console.log("Usage is within free tier. No action needed.");
process.exit(0);
