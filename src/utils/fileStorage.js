const fs = require("fs");
const path = require("path");

const uploadsRoot = path.join(process.cwd(), "uploads");

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsRoot)) {
    fs.mkdirSync(uploadsRoot, { recursive: true });
  }

  return uploadsRoot;
};

const sanitizeFileName = (fileName) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

const saveBase64File = ({ fileName, base64Data }) => {
  ensureUploadsDir();

  const cleanName = sanitizeFileName(fileName);
  const storedName = `${Date.now()}-${cleanName}`;
  const absolutePath = path.join(uploadsRoot, storedName);
  const buffer = Buffer.from(base64Data, "base64");

  fs.writeFileSync(absolutePath, buffer);

  return {
    storedName,
    absolutePath,
    relativePath: path.join("uploads", storedName),
    fileSize: buffer.length
  };
};

module.exports = {
  uploadsRoot,
  ensureUploadsDir,
  saveBase64File
};
