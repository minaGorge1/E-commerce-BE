import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./subcategory.validation.js";
import * as subcategoryController from "./controller/subcategory.js";
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./subcategory.endPoint.js";

const subcategoryRouter = Router({ mergeParams: true })

subcategoryRouter.get("/",
    subcategoryController.getSubcategoryList)

subcategoryRouter.post("/create-subcategory",
    auth(endpoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createSubcategory),
    subcategoryController.createSubcategory)

subcategoryRouter.put("/update-subcategory/:subcategoryId",
    auth(endpoint.update),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.updateSubcategory),
    subcategoryController.updateSubcategory)

subcategoryRouter.delete("/delete-subcategory/:subcategoryId",
    auth(endpoint.delete),
    validation(validators.deleteSubcategory),
    subcategoryController.deleteSubcategory);

export default subcategoryRouter