import connectDB from "../DB/connection.js";
import cors from "cors"
import brandRouter from "./modules/brand/brand.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import categoryRouter from "./modules/category/category.router.js";
import subcategoryRouter from "./modules/subcategory/subcategory.router.js";
import reviewsRouter from "./modules/reviews/reviews.router.js";
import productRouter from "./modules/product/product.router.js";
import orderRouter from "./modules/order/order.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import userRouter from "./modules/user/user.route.js";
import authRouter from "./modules/auth/auth.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
    app.use(cors())
    app.use(express.json({}))

    app.get("/", (req, res, next) => {
        res.json("home")
    })
    app.use("/auth", authRouter)
    app.use("/brand", brandRouter)
    app.use("/cart", cartRouter)
    app.use("/category", categoryRouter)
    app.use("/subcategory", subcategoryRouter)
    
    app.use("/coupon", couponRouter)
    app.use("/order", orderRouter)
    app.use("/product", productRouter)
    app.use("/reviews", reviewsRouter)
    app.use("/user", userRouter)

    app.use("*", (req, res) => res.json(`404 Not found`))

    app.use(globalErrorHandling)
    connectDB()
}

export default initApp