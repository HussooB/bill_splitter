import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "proofs",
    public_id: (_req: any, file: { originalname: any; }) => `${Date.now()}-${file.originalname}`,
    resource_type: "auto", // handles both images and other files
  } as any,
});

export const upload = multer({ storage });
export default cloudinary;
