import path from "path"
import { fileURLToPath } from "url";
import dotenv from "dotenv";
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, "./Config/.env") })

import express from "express";
import initApp from "./src/app.router.js"
const app = express()
const port = 5000
initApp(app, express)

app.listen(port, () => {
    console.log("server is running ...... ")
})