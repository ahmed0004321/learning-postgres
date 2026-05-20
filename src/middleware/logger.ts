import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log('Method, Url, Time:',req.method, req.url, Date.now());
  const log = `\nMethod -> ${req.method}, Time -> ${Date.now()}, URL -> ${req.url}\n`;
  fs.appendFile("logger.text", log, (err) => {
    console.log(err);
  })
  next();
}

export default logger;