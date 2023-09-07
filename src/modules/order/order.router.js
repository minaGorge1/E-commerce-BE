import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./order.validation.js";
import * as orderController from "./controller/order.js"




const orderRouter = Router()


export default orderRouter