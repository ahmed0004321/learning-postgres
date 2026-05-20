// import bcrypt from "bcryptjs";
// import { pool } from "../../DB";
// import config from "../../config/env";

import bcrypt from "bcryptjs";
import { pool } from "../../DB";
import jwt from "jsonwebtoken";
import config from "../../config/env";

// const loginUserIntoDB = async (payload: {email: string, password: string}) => {
//     const {email, password} = payload;
//     //1: check if the user exist or not
//     //2: compare the password
//     //3: generate token
//     //1:
//     const userData = await pool.query(`
//         SELECT * FROM users WHERE email = $1
//         `, [email]);

//         if(userData.rows.length === 0){
//             throw new Error("Invalid Credentials!");
//         }
//         //2:
//         const user = userData.rows[0];
//         const matchPassword = await bcrypt.compare(password, user.password);
//         // console.log(matchPassword);
//         if(!matchPassword){
//             throw new Error("Invalid Credentials!");
//         }

//         //3: generate token:
//         const jwtPayload = {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             is_active: user.is_active
//         }
//         const accessToken = jwt.sign(jwtPayload, config.secret as string, {expiresIn: "1d"})
//         return {accessToken};
// }

// export const authService = {
//     loginUserIntoDB
// }

const loginUserIntoDB = async(payload: {email: string, password: string}) => {
    const {email, password} = payload;

    //1: check if user exist or not
    //2: compare the bcrypt password with the payload password
    //3: generate JWT token

    //1: cheking if user exist or not:
    const existUserOrNot = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email])
        if(existUserOrNot.rows.length === 0){
            throw new Error("Invalid credentials!");
        }
        // console.log(existUserOrNot.rows[0]);

        //2: password comapre: 
        const matchPassword = await bcrypt.compare(password, existUserOrNot.rows[0].password);// 1st password is from payload,
        //existUserOrNot.rows[0].password from DB these two we are comparing;
        if(!matchPassword){
            throw new Error("Invalid credentials!");
        }
        // console.log(matchPassword);

        //3: create JWT token:
        const user = existUserOrNot.rows[0];
        const jwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            is_active: user.is_active
        }
        
        const accessToken = jwt.sign(jwtPayload, config.secret as string, {expiresIn: "1d"});
        return {accessToken};
}

export const authService = {
    loginUserIntoDB
}