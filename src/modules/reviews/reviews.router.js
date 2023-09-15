import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./reviews.validation.js";
import * as reviewsController from "./controller/reviews.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./reviews.endPoint.js";


const reviewsRouter = Router({ mergeParams: true })

reviewsRouter.post('/',
auth(endpoint.create),
validation(validators.createReview),
reviewsController.createReview)

reviewsRouter.patch('/update-review',
auth(endpoint.update),
validation(validators.updateReview),
reviewsController.updateReview)

export default reviewsRouter