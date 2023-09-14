import productModel from "../../../../DB/model/Product.model.js"
import couponModel from "../../../../DB/model/Coupon.model.js"
import cartModel from "../../../../DB/model/Cart.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import orderModel from "../../../../DB/model/Order.model.js"


/* //product
export const createOrder = asyncHandler(async (req, res, next) => {
    const { products, address, phone, note, couponName, paymentType } = req.body;

    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } })
        if (!coupon || coupon.expire.getTime() < Date.now()) {
            return next(new Error(`In-valid coupon`, { cause: 400 }))
        }
        req.body.coupon = coupon;
    }

    const productsIds = []
    const finalProductsList = []
    let subtotal = 0;
    for (const product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })
        if (!checkProduct) {
            return nest(new Error(`In-valid product ${product.productId}`, { cause: 400 }))
        }
        productsIds.push(product.productId)
        product.name = checkProduct.name;
        product.unitPrice = checkProduct.finalPrice;
        product.finalPrice = checkProduct.finalPrice * product.quantity;
        finalProductsList.push(product);
        subtotal += product.finalPrice;
    }

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        note,
        phone,
        products: finalProductsList,
        couponId: req.body.coupon?._id,
        subtotal,
        finalPrice: subtotal - (subtotal * ((req.body.coupon?.amount || 0) / 100)),
        paymentType,
        status: paymentType == 'card' ? 'waitPayment' : 'placed'
    })

    for (const product of products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })
    }

    if (req.body.coupon?._id) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })
    }

    await cartModel.updateOne({ userId: req.user._id }, {
        $pull: {
            products: {
                productId: { $in: productsIds }
            }
        }
    })

    return res.status(201).json({ massage: 'Done', order })
})


//from cart
export const orderFromCart = asyncHandler(async (req, res, next) => {
    const { address, phone, note, couponName, paymentType } = req.body;

    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart.products?.length) {
        return next(new Error(`empty cart`, { cause: 400 }))
    }

    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } })
        if (!coupon || coupon.expire.getTime() < Date.now()) {
            return next(new Error(`In-valid coupon`, { cause: 400 }))
        }
        req.body.coupon = coupon;
    }

    const productsIds = []
    const finalProductsList = []
    let subtotal = 0;
    for (let product of cart.products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })
        if (!checkProduct) {
            return nest(new Error(`In-valid product ${product.productId}`, { cause: 400 }))
        }
        console.log(product);
        productsIds.push(product.productId)
        product = product.toObject()
        product.name = checkProduct.name;
        product.unitPrice = checkProduct.unitPrice;
        product.finalPrice = checkProduct.finalPrice * product.quantity;
        finalProductsList.push(product);
        subtotal += product.finalPrice;
    }

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        note,
        phone,
        products: finalProductsList,
        couponId: req.body.coupon?._id,
        subtotal,
        finalPrice: subtotal - (subtotal * ((req.body.coupon?.amount || 0) / 100)),
        paymentType,
        status: paymentType == 'card' ? 'waitPayment' : 'placed'
    })

    for (const product of cart.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })
    }

    if (req.body.coupon?._id) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })
    }

    await cartModel.updateOne({ userId: req.user._id }, { products: [] })

    return res.status(201).json({ massage: 'Done', order })
}) */

//product or product from cart

export const orderProductOrFromCart = asyncHandler(async (req, res, next) => {
    const { address, phone, note, couponName, paymentType } = req.body;

    if (!req.body.products) {
        const cart = await cartModel.findOne({ userId: req.user._id })
        if (!cart.products?.length) {
            return next(new Error(`empty cart`, { cause: 400 }))
        }
        req.body.isCart = true
        req.body.products = cart.products
    }

    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } })
        if (!coupon || coupon.expire.getTime() < Date.now()) {
            return next(new Error(`In-valid coupon`, { cause: 400 }))
        }
        req.body.coupon = coupon;
    }

    const productsIds = []
    const finalProductsList = []
    let subtotal = 0;
    for (let product of req.body.products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })
        if (!checkProduct) {
            return nest(new Error(`In-valid product ${product.productId}`, { cause: 400 }))
        }
        productsIds.push(product.productId)
        product = req.body.isCart ? product.toObject() : product
        product.name = checkProduct.name;
        product.unitPrice = checkProduct.unitPrice;
        product.finalPrice = checkProduct.finalPrice * product.quantity;
        finalProductsList.push(product);
        subtotal += product.finalPrice;
    }

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        note,
        phone,
        products: finalProductsList,
        couponId: req.body.coupon?._id,
        subtotal,
        finalPrice: subtotal - (subtotal * ((req.body.coupon?.amount || 0) / 100)),
        paymentType,
        status: paymentType == 'card' ? 'waitPayment' : 'placed'
    })

    for (const product of req.body.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })
    }

    if (req.body.coupon?._id) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })
    }

    if (!req.body.isCart) {
        await cartModel.updateOne({ userId: req.user._id }, {
            $pull: {
                products: {
                    productId: { $in: productsIds }
                }
            }
        })
    } else { await cartModel.updateOne({ userId: req.user._id }, { products: [] }) }


    return res.status(201).json({ massage: 'Done', order })
})

export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const {reason} =req.body;
    const order = await orderModel.findOne({ _id: orderId, userId: req.user._id })
    if (!order) {
        return next(new Error(`In-valid`, { cause: 400 }))
    }
    if ((order.status != 'placed' && order.paymentType == 'cash') ||
        (order.status != 'waitPayment' && order.paymentType == 'card')) {
        return next(new Error(`cannot cancel your order after it been changed to ${order.status}`, { cause: 400 }))
    }

    await orderModel.updateOne({ _id: orderId, userId: req.user._id }, { status: 'canceled', updatedBy: req.user._id , reason})
    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } })
    }

    if (order.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } })
    }

    return res.status(201).json({ massage: 'Done', order })
})

export const deliveredOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const {reason} =req.body;
    const order = await orderModel.findById(orderId)
    if (!order) {
        return next(new Error(`In-valid id`, { cause: 400 }))
    }
    if ( ['waitPayment',  'canceled', 'rejected', 'delivered'].includes(order.status)) {
        return next(new Error(`cannot update your order after it been changed to ${order.status}`, { cause: 400 }))
    }

    await orderModel.updateOne({ _id: orderId}, { status: 'delivered', updatedBy: req.user._id })
    return res.status(201).json({ massage: 'Done', order })
})