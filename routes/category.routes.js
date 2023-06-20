import categoryController from "../controllers/categoryController.js";

import { Router } from "express";

const router = Router();

router.post("/createCategory", categoryController.createCategory);
router.post("/", categoryController.categories);

export default router;
