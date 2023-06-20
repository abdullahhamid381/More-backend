import notFound from "../errors/notFound.js";
import Category from "../models/Category.js";

//create Category
const createCategory = async (req, res, next) => {
  try {
    let { name, subCategories } = req.body;

    let category = await Category.create({ name, subCategories });

    return res.status(200).json({ status: "OK", data: category });
  } catch (err) {
    next(err);
  }
};
//fetch all categories
const categories = async (req, res, next) => {
  try {
    let categories = await Category.find().select("-__v");
    return res.status(200).json({ status: "OK", data: categories });
  } catch (err) {
    next(err);
  }
};
export default { createCategory, categories };
