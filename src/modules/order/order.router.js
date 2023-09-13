import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./order.validation.js";
import * as orderController from "./controller/order.js"
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./order.endPoint.js";




const orderRouter = Router()

orderRouter.post('/create-order',
auth(endpoint.create),
orderController.createOrder)

export default orderRouter