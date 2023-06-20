import mongoose from "mongoose";
import auth from "../utils/auth.js";
import User from "../models/user.js";
import REFRESHTOKEN from "../models/RefreshToken.js";
import BadRequest from "../errors/badRequest.js";
import UnAuthorized from "../errors/unAuthorized.js";
import notFound from "../errors/notFound.js";
import ValidationError from "../errors/validationError.js";


//Local SignUp Function=================================================================
const SignUp = async (req, res, next) => {
  try {
    let { password, ...userObj } = req.body;
    let hashedPass = await auth.hashPassword(10, password);
    let user = new User({
      ...userObj,
      password: hashedPass,
      authType: "Local",
    })
    let createdUser = await user.save({runValidators:true,new:true});
    if (!createdUser) {
      let err = new BadRequest("Check your request and try again");
      return next(err);
    }
    let accessToken = auth.accessTokenGenerator(createdUser);
    let refreshToken;
    let exsisting = await REFRESHTOKEN.findOne(
      { userId: createdUser._id },
      { refreshToken: 1, _id: 0 }
    );
    if (!exsisting) {
      refreshToken = auth.refreshTokenGenerator(createdUser);
      REFRESHTOKEN.create({ userId: createdUser._id, refreshToken });
    } else {
      refreshToken = exsisting.refreshToken;
    }

      //delete user.password to not send password to client in response
      let responseUser = {...createdUser._doc}
      delete responseUser.password;
      delete responseUser.isDeleted;
      delete responseUser.emailVerified;
      delete responseUser.__v;

    return res
      .status(201)
      .setHeader("Content-Type", "application/json")
      .json({ status: "OK", accessToken, refreshToken, user: responseUser });
  } catch (err) {
    next(err);
  }
};

//Local Login Function====================================================================================
const Login = async (req, res, next) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email: email }).select("-__v");
  if (!user) {
    let err = new notFound("User Does not exsists");
    return next(err);
  }
  let verified = await auth.verifyPassword(password, user.password);
  if (!verified) {
    let err = new ValidationError("Email or Password is incorrect");
    return next(err);
    
  }
  let accessToken = auth.accessTokenGenerator(user);
  let refreshToken;
  let exsisting = await REFRESHTOKEN.findOne(
    { userId: user._id },
    { refreshToken: 1, _id: 0 }
  );
  if (!exsisting) {
    refreshToken = auth.refreshTokenGenerator(user);
    REFRESHTOKEN.create({ userId: user._id, refreshToken });
  } else {
    refreshToken = exsisting.refreshToken;
  }

  
  //delete user.password to not send password to client in response
  let userObj = {...user._doc}
  delete userObj.password;
  delete userObj.isDeleted;
  delete userObj.emailVerified;

  res.status(200).setHeader("Content-Type", "application/json").json({
    status: "OK",
    accessToken,
    refreshToken,
    user: userObj,
  });
};

// Local Logout Function=======================================================================================
const Logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie("session-id");
};

// Refresh Access Token=========================================================================================
const RefreshAccessToken = async (req, res, next) => {
  let refreshToken = req.body.refreshToken;
  let verified = await auth.verifyRefreshToken(refreshToken);

  if (!verified) {
    let err = new UnAuthorized("You are not Authroized");
    return next(err);
  }
  let found = await REFRESHTOKEN.findOne({ refreshToken: refreshToken });
  if (!found) {
    let err = new UnAuthorized("You are not Authroized");
    return next(err);
  }
  let user = await User.findById(verified._id);
  if (!user) {
    let err = new UnAuthorized("You are not Authroized");
    return next(err);
  }
  let accessToken = auth.accessTokenGenerator(user);
  res
    .status(201)
    .setHeader("Content-Type", "application/json")
    .json({ status: "OK", accessToken, refreshToken });
};

export default {
  SignUp,
  Login,
  RefreshAccessToken,
};
