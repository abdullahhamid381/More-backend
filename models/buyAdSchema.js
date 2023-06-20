import mongoose from "mongoose";

const buyadSchema = new mongoose.Schema(
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

    isDeleted: {
      type: Boolean,
      default: false,
    },
    transaction: {
      type: String,
      enum: ["demand", "service"],
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
    },
    views: {
      type: Number,
      default: 0,
    },
    boost: {
      type: Boolean,
      default: false,
    },
    boostStart: {
      type: Date,
    },
    boostEnd: {
      type: Date,
    },
  },
  { timestamps: true }
);

buyadSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
buyadSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});
buyadSchema.pre("findById", function () {
  this.where({ isDeleted: false });
});

const Ad = mongoose.model("Ad", buyadSchema);

export default Ad;
