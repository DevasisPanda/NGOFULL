import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from the CLOUDINARY_URL environment variable
// Example: CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
if (!process.env.CLOUDINARY_URL) {
  console.warn("WARNING: CLOUDINARY_URL is not set in the environment variables.");
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error("CLOUDINARY_URL is not configured.");
  }

  const key = appendHashSuffix(normalizeKey(relKey));
  
  // Convert string or Uint8Array to Buffer for Cloudinary upload stream
  const buffer = typeof data === "string" 
    ? Buffer.from(data, "utf-8") 
    : Buffer.from(data);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: key.split('.')[0], // Cloudinary doesn't need extension in public_id usually
        resource_type: "auto",
        folder: "ngo-management",
      },
      (error, result) => {
        if (error || !result) {
          return reject(new Error(`Cloudinary upload failed: ${error?.message || "Unknown error"}`));
        }
        resolve({ key: result.public_id, url: result.secure_url });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  // Cloudinary URLs are generally permanent, but if we just stored the key, we'd reconstruct it.
  // In our DB, we usually save the full URL returned from storagePut, so this is just a stub.
  const key = normalizeKey(relKey);
  return { key, url: relKey }; // Returning as-is assuming full URL is passed
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  // Cloudinary assets are public by default unless strictly configured otherwise.
  return relKey; // Return the URL directly.
}
