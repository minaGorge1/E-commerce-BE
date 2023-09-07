import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./reviews.validation.js";
import * as reviewsController from "./controller/reviews.js";


const reviewsRouter = Router()


export default reviewsRouter