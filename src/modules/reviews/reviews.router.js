import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./reviews.validation.js";
import * as reviewsController from "./controller/reviews.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./reviews.endPoint.js";


const reviewsRouter = Router({ mergeParams: true })

reviewsRouter.get('/',
reviewsController.getReviews)

reviewsRouter.post('/',
auth(endpoint.create),
validation(validators.createReview),
reviewsController.createReview)

reviewsRouter.patch('/:reviewId',
auth(endpoint.update),
validation(validators.updateReview),
reviewsController.updateReview)

reviewsRouter.delete("/:reviewId",
    auth(endpoint.delete),
    validation(validators.deleteReview),
    reviewsController.deleteReview);

export default reviewsRouter