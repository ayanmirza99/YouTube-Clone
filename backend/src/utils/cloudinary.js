import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on Cloudinary
    const resp = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath); // will remove the locally saved temporary file as the upload operation completed succesfully
    return resp;
  } catch (error) {
    fs.unlinkSync(localFilePath); // will remove the locally saved temporary file as the upload operation failed
    return null;
  }
};

export const deleteFromCloudinary = async (url) => {
  try {
    const regex = /(?:\/v\d+\/)?([^/]+)\.\w+$/;
    const match = url.match(regex);
    if (!match) {
      throw new Error("Invalid URL format");
    }
    const publicId = match[1];
    const resp = await cloudinary.uploader.destroy(publicId);
    return resp;
  } catch (error) {
    console.error("Error deleting file:", error);
    return null;
  }
};
