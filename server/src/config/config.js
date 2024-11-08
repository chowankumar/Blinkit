import "dotenv/config"
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models";

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore(
    {
        uri : process.env.MONGO_URI,
        collection : "sessions",
    }
)

sessionStore.on("error", (error)=>{
    console.log("Session store error" , error)
})

const authenticate = async (email,password)=>{
    if(email == "chowanmalhani5@gmail.com" && password == "chowan54"){
      return Promise.resolve({email:email,password : password});
    } else {
        return null;
    }
};

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD