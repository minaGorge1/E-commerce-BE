import { validation } from "../../middleware/validation.js";
import { endpoint } from "./cart.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { Router } from "express";
import * as validators from "./cart.validation.js";
import * as cartController from "./controller/cart.js"

const cartRouter = Router()

cartRouter.post("/create-cart",
auth(endpoint.create),
validation(validators.addCart),
cartController.addCart)

export default cartRouter