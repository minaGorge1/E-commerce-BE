import { customAlphabet } from "nanoid"
import userModel from "../../../../DB/model/User.model.js"
import sendEmail from "../../../utils/email.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { createToken, verifyToken } from "../../../utils/generateAndVerifyToken.js"
import { compare, hash } from "../../../utils/hashAndCompare.js"



export const test = asyncHandler((req, res, next) => {
    return res.json({ message: "hi" })
})


//signUp
export const signUp = asyncHandler(async (req, res, next) => {
    const email = req.body.email
    //check email exist
    if (await userModel.findOne({ email: email.toLowerCase() })) {
        return next(new Error("Email Exist", { cause: 409 }))
    }
    //confirmEmail
    const token = createToken({ payload: { email }, signature: process.env.EMAIL_TOKEN, expiresIn: 60 * 5 })
    const refreshToken = createToken({ payload: { email }, signature: process.env.EMAIL_TOKEN, expiresIn: 60 * 60 * 24 })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/requestNewEmail/${refreshToken}`
    const html = `<a href="${link}">Click me to confirm Email</a> <br> <br> <br>
    <a href="${refreshLink}">Request new email</a>`

    if (! await sendEmail({ to: email, subject: "confirm-Email", html })) {
        return next(new Error("Email rejected", { cause: 400 }))
    }
    //hashPassword
    req.body.password = hash({ plaintext: req.body.password, saltRound: parseInt(process.env.SALTROUND) })
    //save
    const user = await userModel.create(req.body)
    return res.status(201).json({ message: "Done", user })
})

// dy al page aly hiro7lha fy al massage al gmail w  front end 3la login
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = verifyToken({ token, signature: process.env.EMAIL_TOKEN })
    if (!decoded) {
        return next(new Error("In-valid token payload", { cause: 400 }))
    }
    const user = await userModel.updateOne({ email: decoded.email.toLowerCase() }, { confirmEmail: true })
    if (!user.matchedCount) {
        //return res.status(200).redirect("https://stackoverflow.com/")
        /* return res.status(200).render(`invalidEmail` , {message: "not register account"}) */
        return res.status(200).send(`<p>not register account</p>`)
        /* return next(new Error("In-Valid account", { cause: 404 })) */
    } else {
        /* return res.status(200).redirect(`${process.env.FE_URL}/login`) */
        return res.status(200).send(`<p>Done</p>`)
    }
})

//requestNewEmail
export const requestNewEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = verifyToken({ token: token, signature: process.env.EMAIL_TOKEN, })

    if (!decoded) {
        return next(new Error("In-valid token payload", { cause: 400 }))
    }
    const check = await userModel.findOne({ email: decoded.email.toLowerCase() })
    if (!check) {
        return next(new Error("In-valid email", { cause: 400 }))
    }
    if (check.confirmEmail) {
        return res.status(200).send("<p>you really confirm</p>")
    }

    const newToken = createToken({ payload: { email: decoded.email }, signature: process.env.EMAIL_TOKEN, expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/requestNewEmail/${token}`

    const html = `<a href="${link}">Click me to confirm Email</a> <br> <br> <br>
    <a href="${refreshLink}">Request new email</a>`
    if (! await sendEmail({ to: decoded.email, subject: "confirm_Email", html })) {
        return next(new Error("Email rejected", { cause: 400 }))
    }
    return res.status(200).json("done please check your email")
})

//signIn
export const signIn = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body
    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) {
        return next(new Error(" Email not exist ", { cause: 404 }))
    }
    if (!user.confirmEmail) {
        return next(new Error("please confirm your email", { cause: 400 }))
    }
    const match = compare({ plaintext: password, hashValue: user.password })
    if (!match) {
        return next(new Error("In-Valid password", { cause: 400 }))
    }
    const access_token = createToken({ payload: { id: user._id, role: user.role, userName: user.userName, email: user.email }, expiresIn: 30 * 60 })
    const refresh_token = createToken({ payload: { id: user._id, role: user.role, userName: user.userName, email: user.email }, expiresIn: 60 * 60 * 24 * 360 })
    user.status = "online"
    await user.save()
    return res.status(200).json({ message: "Done", access_token, refresh_token })
})


//sendCode
export const sendCode = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    // const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const forgetCode = customAlphabet("123456789", 4)
    const user = await userModel.findOneAndUpdate({ email: email.toLowerCase() }, { code: forgetCode() }, { new: true })
    if (!user) {
        return next(new Error("not found this account", { cause: 404 }))
    }
    const html = `<a>the code is <b>${user.code}</b> </a>`
    //send confirm to gmail
    if (! await sendEmail({ to: email, subject: "Forget Password", html })) {
        return next(new Error("Email rejected", { cause: 400 }))
    }
    return res.status(200).json({ message: "Done please check your email" })

})

//forGotPassword
export const forGotPassword = asyncHandler(async (req, res, next) => {
    const { email, code, password } = req.body
    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) {
        return next(new Error("not found this account", { cause: 404 }))
    }
    if (user.code != code) {
        return next(new Error("In-valid code", { cause: 404 }))
    }
    user.password = hash({ plaintext: password })
    user.code = null
    user.changePasswordTime = Date.now()
    await user.save()
    return res.status(200).json({ message: "Done" })

})

//logOut
export const logOut = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, { status: "offline" })
})
