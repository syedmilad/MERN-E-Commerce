import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, res, callback) {
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const id = uuid();
    const extentionName = file.originalname.split(".").pop();
    const newId = `${id}.${extentionName}`;
    callback(null, newId);
  },
});

export const sinleUpload = multer({ storage }).single("photo");
