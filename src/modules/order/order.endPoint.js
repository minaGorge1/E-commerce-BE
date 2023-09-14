import { roles } from "../../middleware/auth.js";



export const endpoint = {
    create: [roles.Admin , roles.User],
    cancel: [roles.Admin , roles.User],
    delivered: [roles.Admin],
}