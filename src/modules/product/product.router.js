import * as productController from "./controller/product.js"
import * as validators from "./product.validation.js";
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";
import { validation } from "../../middleware/validation.js";
import { endpoint } from "./product.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { Router } from "express";

const productRouter = Router()

productRouter.get("/",productController.getProducts)

productRouter.post("/create-product",
    auth(endpoint.create),
    fileUpload(fileValidation.image).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ]),
    validation(validators.createProduct),
    productController.createProduct)

productRouter.put("/update-product/:productId",
    auth(endpoint.update),
    fileUpload(fileValidation.image).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ]),
    validation(validators.updateProduct),
    productController.updateProduct)

    productRouter.delete("/delete-product/:productId",
    auth(endpoint.delete),
    validation(validators.deleteProduct),
    productController.deleteProduct);

export default productRouter