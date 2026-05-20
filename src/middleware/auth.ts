import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/env";
import { pool } from "../DB";
import type { ROLES } from "../types";



//amara function er moddhe middleware function return korbo
const auth = (...roles: ROLES[]) => {
  console.log(roles);
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(roles);
    try {
      // console.log("this is prtected route");
      // console.log(req.headers.authorization);

      //process::
      //1: check if the token exist or not from the req.headers er vitor
      //2: verify the token using jwt verify
      //3: find the user into database using email
      //4: if the user is is_active true or false or not

      const token = req.headers.authorization;
      console.log(token);
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!!",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;
      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email = $1
        `,
        [decoded.email],
      );
      // console.log(userData);

      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found!!",
        });
      }

      if (!userData.rows[0].is_active) {
        return res.status(403).json({
          success: false,
          message: "Forbidden!!",
        });
      };

      console.log(user.role);

      if(roles.length && !roles.includes(user.role)){
        return res.status(403).json({
          success: false,
          message: "Forbidden!! this role have no access",
        });
      }

      req.user = decoded; // req: { user: {}}
      next();
    } catch (error) {
      next(Error);
    }
  };
};

export default auth;
