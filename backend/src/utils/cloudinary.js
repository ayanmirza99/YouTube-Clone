import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on Cloudinary
    const resp = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file uploaded succesfully
    console.log("File has been successfully uploaded: ", resp.url);
    return resp;
  } catch (error) {
    fs.unlinkSync(localFilePath); // will remove the locally saved temporary file as the upload operation failed
    return null;
  }
};
