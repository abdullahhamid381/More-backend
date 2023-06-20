import mongoose from "mongoose";

const myInfoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    address: {
      type: String,

      minlength: 3,
      maxlength: 500,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    Field: {
      type: [String],
    },
    activityDescription: {
      type: String,
      minlength: 3,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const MyInfo = mongoose.model("MyInfo", myInfoSchema);

export default MyInfo;
