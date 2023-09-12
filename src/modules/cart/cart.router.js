import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./cart.endPoint.js";
import { Router } from "express";
import * as validators from "./cart.validation.js";
import * as cartController from "./controller/cart.js"

const cartRouter = Router()
cartRouter.get("/",
    auth(endpoint.get), 
    cartController.getMyCart)

cartRouter.post("/add-cart",
    auth(endpoint.add),
    validation(validators.addCart),
    cartController.addCart)

cartRouter.delete("/delete-cart",
    auth(endpoint.delete),
    validation(validators.deleteFromCart),
    cartController.deleteFromCart)

    
cartRouter.delete("/clear-cart",
auth(endpoint.delete),
cartController.clearCart)

export default cartRouter