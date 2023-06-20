import { Router } from "express";
import Controller from "../controllers/userController.js";
import auth from "../utils/auth.js";
const router = Router();

//GET USER INFO
router.post("/getInfo", auth.verifyUser, Controller.getUserData);
router.put("/updateInfo", auth.verifyUser, Controller.addData);

export default router;
