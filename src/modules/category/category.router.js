import subcategoryRouter from "../subcategory/subcategory.router.js";
import * as categoryController from "./controller/category.js";
import * as validators from "./category.validation.js";
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";
import { validation } from "../../middleware/validation.js";
import { auth, roles } from "../../middleware/auth.js";
import { endpoint } from "./category.endPoint.js";
import { Router } from "express";


const categoryRouter = Router()

categoryRouter.use("/:categoryId/subcategory", subcategoryRouter)

categoryRouter.get("/",
    /*     auth(Object.values(roles)), */
    categoryController.getCategoryList)

categoryRouter.post("/create-category",
    validation(validators.headers , true),
    auth(endpoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createCategory),
    categoryController.createCategory)

categoryRouter.post("/update-category/:categoryId",
    auth(endpoint.update),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.updateCategory),
    categoryController.updateCategory)

categoryRouter.delete("/delete-category/:categoryId",
    auth(endpoint.delete),
    validation(validators.deleteCategory),
    categoryController.deleteCategory);

export default categoryRouter