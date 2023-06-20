import mongoose from "mongoose";

const selladSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 500,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: [String],
      required: true,
      validate: (value) => Array.isArray(value) && value.length > 0,
    },
    subCategory: {
      type: String,
      required: true,
    },
    // multiple images
    images: {
      type: [String],
      required: true,
    },
    // Todo: discuss with team

    isDeleted: {
      type: Boolean,
      default: false,
    },
    transaction: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    telephone: {
      type: [String],
      required: true,
      validate: (value) => Array.isArray(value) && value.length > 0,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    views: {
      type: Number,
      default: 0,
    },
    boost: {
      type: Boolean,
      default: false,
    },
    Location: {
      type: String,
      required: true,
    },
    League: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
    },
  },
  { timestamps: true }
);

selladSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
selladSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});
selladSchema.pre("findById", function () {
  this.where({ isDeleted: false });
});

const Ad = mongoose.model("Ad", selladSchema);

export default Ad;
