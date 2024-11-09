import AdminJS from "adminjs";
import AdminFastify from "@adminjs/fastify";
import * as AdminJsMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import {authenticate, CookiePassword, sessionStore } from "./config.js";
import {dark,light,noSidebar} from '@adminjs/themes'

AdminJS.registerAdapter(AdminJsMongoose);

export const admin = new AdminJS(
    {
        resources: [
            {
                resource: Models.Customer,
                options: {
                    listProperties: ["phone","role","isActivated"],
                    filterProperties: ["phone","role"]
                }
            },
            {
                resource: Models.DeliveryPartner,
                options: {
                    listProperties: ["email", "role", "isActivated"],
                    filterProperties: ["phone", "role"]
                }
            },
            {
                resource: Models.Admin,
                options: {
                    listProperties:["email","role","isActivated"],
                    filterProperties: ["email","role"]
                }
            },
            { resource: Models.Branch },
            { resource: Models.Product },
            { resource: Models.Category },
            { resource: Models.Order},
            { resource: Models.Counter},


        ],

        branding: {
            companyName: "Blinkit",
            withMadeWithLove: false
        },
        deafualtTheme:dark.id,
        availableThemes:[dark,light,noSidebar],
        rootPath: "/admin"
    }
)

export const buildAdminRouter = async (app) => {
    await AdminFastify.buildAuthenticatedRouter(admin,
        {
            authenticate,
            cookiePassword:CookiePassword,
            cookieName: "adminjs",
        },
        app,
        {   
            store: sessionStore,
            saveUnintialized: true,
            secret: CookiePassword,
            cookie: {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production"
            }
        }
    )}