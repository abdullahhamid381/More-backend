import { Router } from "express";
const router = Router();
import Controller from "../controllers/authController.js";
import { corsAll, corsWithOptions } from "../utils/cors.js";
import {
  loginValidators,
  refreshTokenValidators,
  signupValidators,
  validate,
} from "../middleware/validator.js";
import passport from "passport";
import RefreshToken from "../models/RefreshToken.js";
import auth from "../utils/auth.js";
import UnAuthorized from "../errors/unAuthorized.js";

//local auth login
router.post("/login", corsAll, loginValidators(), validate, Controller.Login);

//local auth signup
router.post(
  "/signup",
  corsAll,
  signupValidators(),
  validate,
  Controller.SignUp
);

//Refresh Access Token
router.post(
  "/RefreshAccessToken",
  corsAll,
  refreshTokenValidators(),
  validate,
  Controller.RefreshAccessToken
);

// Google Routes
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/done",
    failureRedirect: "/auth/google/fail",
    session: true,
  })
);

router.get("/google/done", async (req, res, next) => {
  let accessToken = auth.accessTokenGenerator(req.user);
  let refreshToken = auth.refreshTokenGenerator(req.user);
  await RefreshToken.findOneAndUpdate(
    { userId: req.user._id },
    { userId: req.user._id, refreshToken: refreshToken },
    { upsert: true }
  );
  return res
    .status(200)
    .json({ status: "OK", accessToken, refreshToken, user: req.user });
});
router.get("/google/fail", (req, res, next) => {
  return next(new UnAuthorized("Google Authentication Failed"));
});

export default router;
