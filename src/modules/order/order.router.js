import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./order.validation.js";
import * as orderController from "./controller/order.js"
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./order.endPoint.js";




const orderRouter = Router()

/* //product
orderRouter.post('/create-order',
auth(endpoint.create),
orderController.createOrder)

//from cart
orderRouter.post('/create-order-from-cart',
auth(endpoint.create),
orderController.orderFromCart) */

//from cart + products
orderRouter.post('/create-order-product-or-cart',
auth(endpoint.create),
validation(validators.createOrder),
orderController.orderProductOrFromCart)

orderRouter.patch('/cancel-order/:orderId',
auth(endpoint.cancel),
validation(validators.cancelOrder),
orderController.cancelOrder)

orderRouter.patch('/delivered-order/:orderId',
auth(endpoint.delivered),
validation(validators.deliveredOrder),
orderController.deliveredOrder)

export default orderRouter