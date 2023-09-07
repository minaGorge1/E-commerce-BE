import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./product.validation.js";
import * as productController from "./controller/product.js"
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";

const productRouter = Router()
productRouter.post("/create-product",
    fileUpload(fileValidation).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ]),
    productController.createProduct)


export default productRouter