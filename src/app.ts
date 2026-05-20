import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./DB";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/Auth/auth.route";
import fs from "fs";
import logger from "./middleware/logger";
const app: Application = express();

// data onek format e pathano jay...json onek popular
// but text, xml, javascript, html and form data so shei data gula ke recieve korar por
// express aikhane recieve kore and parse type er kicu kore jeno body er moddhe access
//acess kora jay
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // ai url encoded e akta issue ace, sheta holo jodi ami nested type data
//send kori amake bole dite hobe {} bracket e extended, na hole oo data nibe na

//custom middleware
app.use(logger);


app.get("/", (req: Request, res: Response) => {
  // res.send('Hello World!')
  res.status(200).json({
    massage: "Express server",
    author: "next level",
  });
});

app.use('/api/users', userRoute);

app.get("/api/users", userRoute);

app.get("/api/users/:id", userRoute);

app.put("/api/users/:id", userRoute);

app.delete("/api/users/:id", userRoute);


//for profiles
app.use('/api/profiles', profileRoute);

app.post('/api/profiles', profileRoute)

app.use('/api/auth', authRoute)
export default app;