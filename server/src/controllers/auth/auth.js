import { Customer,DeliveryPartner } from "../../models";
import jwt from "jsonwebtoken";

const generateToken = (user)=>{


    const accessToken = jwt.sign(
        {userId: user._id, role : user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : "1d"}

    );

    const refreshToken = jwt.sign(
        {userId: user._id, role : user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn : "1d"}

    );
    return {refreshToken,accessToken}
};