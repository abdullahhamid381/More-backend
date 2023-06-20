import mongoose from "mongoose";

import MyInfo from "../models/myInfo.js";
import NOTFOUND from "../errors/notFound.js";
import Ad from "../models/sellAdSchema.js";
import User from "../models/user.js";

//fetch all myInfo
const myInfos = async (req, res, next) => {
  try {
    let myInfos = await MyInfo.find().select("-__v").populate("user", "-__v");
    return res.status(200).json({ status: "OK", data: myInfos });
  } catch (err) {
    next(err);
  }
};
//fetch myInfo by id
const myInfo = async (req, res, next) => {
  try {
    let id = req.user._id;
    let myInfo = await MyInfo.findOne({ user: id })
      .select("-__v")
      .populate("user", "-_id -password -createdAt -updatedAt -isDeleted -__v");
    const ads = await Ad.find({ author: id }).select("-__v");
    if (!myInfo) {
      let newMyinfo = new MyInfo({
        user: id,
      });
      myInfo = await newMyinfo.save();
    }

    console.log({ userData: myInfo, ads });

    return res
      .status(200)
      .json({ status: "OK", data: { userData: myInfo, ads } });
  } catch (err) {
    next(err);
  }
};

//create myInfo
const createMyInfo = async (req, res, next) => {
  let user = req.user._id;
  const { name, activityDescription, address, gender, Field } = req.body;
  const myInfo = new MyInfo({
    user,
    activityDescription,

    address,
    gender,
    Field,
  });
  try {
    const newMyInfo = await myInfo.save();
    res.status(201).json({ data: newMyInfo });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//update myInfo
const updateMyInfo = async (req, res, next) => {
  try {
    const { activityDescription, address, gender, ...userChange } = req.body;
    let infoChange = { activityDescription, address, gender };
    let user = req.user._id;
    if (infoChange !== {} && infoChange !== undefined && infoChange !== null) {
      const myInfo = await MyInfo.findOneAndUpdate(
        { user: user },
        {
          $set: {
            ...infoChange,
          },
        },
        { new: true, upsert: true }
      );

      if (!myInfo) {
        let newMyinfo = new MyInfo({
          user,
          ...infoChange,
        });
        myInfo = await newMyinfo.save();
      }
    }
    if (userChange !== {} && userChange !== undefined && userChange !== null) {
      const user = await User.findOneAndUpdate(
        { _id: user },
        {
          $set: {
            ...userChange,
          },
        },
        { new: true, upsert: true }
      );
    }

    res.status(201).json({ data: { userData: { user, ...myInfo._doc } } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default {
  myInfos,
  myInfo,
  createMyInfo,
  updateMyInfo,
};
