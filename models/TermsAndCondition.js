import mongoose from "mongoose";

const termsAndConditionSchema = new mongoose.Schema(
  {
    termsAndCondition: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1500,
    },
  },
  { timestamps: true }
);

const TermsAndCondition = mongoose.model(
  "TermsAndCondition",
  termsAndConditionSchema
);

export default TermsAndCondition;
