import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  subCategories: {
    type: [String],
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
