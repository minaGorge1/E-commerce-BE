import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./brand.validation.js";
import * as brandController from "./controller/brand.js"
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./brend.endPoint.js";



const brandRouter = Router()


brandRouter.get("/",
    brandController.getBrandList)

brandRouter.post("/create-brand",
    auth(endpoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createBrand),
    brandController.createBrand)

brandRouter.put("/update-brand/:brandId",
    auth(endpoint.update),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.updateBrand),
    brandController.updateBrand)

brandRouter.delete("/delete-brand/:brandId",
    auth(endpoint.delete),
    validation(validators.deleteBrand),
    brandController.deleteBrand);

export default brandRouter