import { Router } from "express";

//controller import
import Controller from "../controllers/uploadController.js";
import { upload } from "../controllers/uploadController.js";

const router = Router();

router.route("/uploadFile").post(upload.array("files"), Controller.uploadFiles);

router.route("/file/:filename").get(Controller.getFile);

router.route("/image/:filename").get(Controller.getImageFile);

export default router;
