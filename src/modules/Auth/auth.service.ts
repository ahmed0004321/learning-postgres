import bcrypt from "bcryptjs";
import { pool } from "../../DB";
import jwt from "jsonwebtoken";
import config from "../../config/env";

const loginUserIntoDB = async (payload: {email: string, password: string}) => {
    const {email, password} = payload;
    //1: check if the user exist or not
    //2: compare the password
    //3: generate token
    //1:
    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email]);

        if(userData.rows.length === 0){
            throw new Error("Invalid Credentials!");
        }
        //2:
        const user = userData.rows[0];
        const matchPassword = await bcrypt.compare(password, user.password);
        // console.log(matchPassword);
        if(!matchPassword){
            throw new Error("Invalid Credentials!");
        }

        //3: generate token:
        const jwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            is_active: user.is_active
        }
        const accessToken = jwt.sign(jwtPayload, config.secret as string, {expiresIn: "1d"})
        return {accessToken};
}

export const authService = {
    loginUserIntoDB
}