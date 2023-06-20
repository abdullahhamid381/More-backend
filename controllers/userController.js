import mongoose from "mongoose";

import NOTFOUND from "../errors/notFound.js";
import Ad from "../models/sellAdSchema.js";
import User from "../models/user.js";

//Add data to user
const addData = async (req, res, next) => {
  try {
    const addData = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { ...req.body } },
      { new: true }
    );
    if (!addData) {
      let err = new NOTFOUND("User not found");
      return next(err);
    }
    return res.status(200).json({ status: "OK", data: addData });
  } catch (err) {
    next(err);
  }
};

//get user data
const getUserData = async (req, res, next) => {
  try {
    const userData = await User.findOne({ _id: req.user._id }).select(
      "-__v -password -createdAt -updatedAt -isDeleted -__v"
    );
    if (!userData) {
      let err = new NOTFOUND("User not found");
      return next(err);
    }
    return res.status(200).json({ status: "OK", data: userData });
  } catch (err) {
    next(err);
  }
};

export default { addData, getUserData };
