import { roles } from "../../middleware/auth.js";



export const endpoint = {
    get: [roles.Admin , roles.User],
    add: [roles.Admin , roles.User], // user
/*     update: [roles.Admin],*/
    delete: [roles.Admin , roles.User] 
}