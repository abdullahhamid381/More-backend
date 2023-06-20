import passport from "passport";
import jwt from "jsonwebtoken";
import JwtStrategyPassport from "passport-jwt";
const JwtStrategy = JwtStrategyPassport.Strategy;
import ExtractJwtPassport from "passport-jwt";
const ExtractJwt = ExtractJwtPassport.ExtractJwt;
import bcrypt from "bcryptjs";
import USER from "../models/user.js";
import UnAuthorized from "../errors/unAuthorized.js";
import dotenv from "dotenv";
import User from "../models/user.js";
// import passport from "passport";
import GoogleStrategyPassport from "passport-google-oauth2";
const GoogleStrategy = GoogleStrategyPassport.Strategy;
dotenv.config();

//verify password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

//hash Password
const hashPassword = async (saltRounds, password) => {
  let salt = await bcrypt.genSalt(saltRounds);
  let hashed = await bcrypt.hash(password, salt);
  return hashed;
};

// Token generator functions
const accessTokenGenerator = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      admin: user.admin,
    },
    process.env.ACCESS_TOKEN_PRIVATE_KEY
    //TODO: Uncomment this line when deploying to production
    // { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const refreshTokenGenerator = (user) => {
  return jwt.sign(
    {
      _id: user._id,
    },
    process.env.REFRESH_TOKEN_PRIVATE_KEY
  );
};

// Extracting Token and verifying it when verifyUser function is called
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;

const jwtPassport = passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      let user = await USER.findById(payload._id);
      if (!user) {
        let err = new NOTFOUND("User Does not exsists");
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      done(err);
    }
  })
);

// Verify User
const verifyUser = passport.authenticate("jwt", { session: false });

// verfiy Admin
const verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    let err = new UnAuthorized("You are not Authorized for this request");
    return next(err);
  }
};

// RefreshToken verification
const verifyRefreshToken = async (refreshToken) => {
  return await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
};



// Google Strategy
const google = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let foundUser = await User.findOne({ googleId: profile.id });
        if (!foundUser) {
          let newUser = await User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.email,
            // avatar: profile.picture,
            emailVerified: profile.email_verified,
            authType: "google",
          });
          let createdUser = await newUser.save();
          if (!createdUser) {
            let err = new Error("Something went Wrong");
            return done(err, false);
          }

          //  Creating our backend logic acces token not using googles access token
          // let accessToken = accessTokenGenerator(createdUser);
          return done(null, createdUser);
        }
        //  Creating our backend logic acces token not using googles access token
        // let accessToken = accessTokenGenerator(foundUser);
        // if (foundUser.status === "Suspended") {
        //   let err = new UnAuthorized("You are suspended Contact Admin");
        //   return next(err);
        // }
        if (foundUser.isDeleted) {
          let err = new UnAuthorized("Your account has been deleted");
          return next(err);
        }
        return done(null, foundUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

//google
// Serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});
passport.deserializeUser((id, cb) => {
  User.findById(id).then((user)=>{
    cb(null, user);
  }).catch(err=>{ return cb(err)})
});

export default {
  verifyPassword,
  verifyAdmin,
  verifyRefreshToken,
  verifyUser,
  hashPassword,
  refreshTokenGenerator,
  accessTokenGenerator,
};
