const fs = require("fs");
const path = require("path");
const { put, del } = require("@vercel/blob");

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const normalizeLocalFilename = (value) => {
  const source = value || `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return source.split("/").pop() || `upload-${Date.now()}.png`;
};

async function uploadToBlob(file, options = {}) {
  const { filename, contentType, access = "public" } = options;
  const fileBuffer = Buffer.isBuffer(file) ? file : Buffer.from(file);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    const safeName = normalizeLocalFilename(filename);
    const localPath = path.join(uploadDir, safeName);
    fs.writeFileSync(localPath, fileBuffer);
    return `http://localhost:5000/uploads/${safeName}`;
  }

  const blob = await put(filename || `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}`, fileBuffer, {
    access,
    contentType,
  });

  return blob.url;
}

async function deleteFromBlob(url) {
  if (!url) {
    return false;
  }

  if (url.startsWith("/uploads/")) {
    const localPath = path.join(uploadDir, path.basename(url));
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    return true;
  }

  if (!url.includes("blob.vercel-storage.com")) {
    return false;
  }

  try {
    await del(url);
    return true;
  } catch (error) {
    console.error("Blob delete failed:", error.message);
    return false;
  }
}

module.exports = { uploadToBlob, deleteFromBlob };
