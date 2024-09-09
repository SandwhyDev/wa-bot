const fs = require("fs");
const path = require("path");

export const generateRandomString = () => {
  // Implementasikan logika untuk generate string acak
  return Math.random().toString(36).substring(2, 15);
};

export const processMedia = async (msg) => {
  try {
    const media = await msg.downloadMedia();

    // Mendapatkan ekstensi file
    let ext = "";

    // Cek jenis media dan tentukan ekstensi
    if (media.mimetype.includes("audio")) {
      ext = media.mimetype.split(";")[1]?.split("=")[1] || "opus";
    } else if (media.mimetype.includes("application")) {
      ext = path.extname(media.filename).split(".")[1];
    } else {
      ext = media.mimetype.split("/")[1];
    }

    const buffer = Buffer.from(media.data, "base64");

    const filename = await generateRandomString();

    const filePath = path.join(__dirname, `../../public/${filename}.${ext}`);

    await fs.promises.writeFile(filePath, buffer);

    console.log("File saved successfully!");

    return `${filename}.${ext}`;
  } catch (error) {
    console.error("Error processing media:", error);
    throw error;
  }
};
