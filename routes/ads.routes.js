import { Router } from "express";
const router = Router();
import Controller from "../controllers/adController.js";
import { corsAll, corsWithOptions } from "../utils/cors.js";
import auth from "../utils/auth.js";
import {
  loginValidators,
  refreshTokenValidators,
  signupValidators,
  updateAd,
  validate,
} from "../middleware/validator.js";
import { upload } from "../controllers/uploadController.js";
import cors from "cors";

///all origin cors
router.use(cors({ origin: "*" }));

//local auth login
router.post("/getAll", Controller.ads);
router.post("/getAllAdmin", auth.verifyUser, Controller.adsAdmin);
router.post(
  "/createAd",
  auth.verifyUser,

  Controller.createAd
);
router.post("/getAd", Controller.ad);
router.put(
  "/updateAd",
  auth.verifyUser,
  updateAd(),
  validate,
  Controller.updateAd
);
router.delete("/deleteAd", auth.verifyUser, Controller.deleteAd);

export default router;
