import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 3000;

// data onek format e pathano jay...json onek popular
// but text, xml, javascript, html and form data so shei data gula ke recieve korar por
// express aikhane recieve kore and parse type er kicu kore jeno body er moddhe access
//acess kora jay
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // ai url encoded e akta issue ace, sheta holo jodi ami nested type data
//send kori amake bole dite hobe {} bracket e extended, na hole oo data nibe na

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_oBiudY1QrM4L@ep-late-glade-apvqccro-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
            `);
    console.log("database connected Successfully!");
  } catch (error) {
    console.log(error);
  }
};
initDB();

app.get("/", (req: Request, res: Response) => {
  // res.send('Hello World!')
  res.status(200).json({
    massage: "Express server",
    author: "next level",
  });
});

app.post("/api/users", async (req: Request, res: Response) => {
  // console.log(req.body);
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
    INSERT INTO users(name, email, password, age) VALUES($1,$2,$3,$4)
    RETURNING *
    `,
      [name, email, password, age],
    );
    // console.log(result);
    res.status(201).json({
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
            SELECT * FROM users
            `);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users not found!",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `
            SELECT * FROM users WHERE id = $1
            `,
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users not found!",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, age, is_active } = req.body;
    // console.log(id, {name, password, age, is_active});
    const result = await pool.query(
      `
        UPDATE users
        SET name = COALESCE($1, name),
        password = COALESCE($2, password),
        age = COALESCE($3, age),
        is_active = COALESCE($4, is_active)

        WHERE id = $5 RETURNING *
        `,
      [name, password, age, is_active, id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found for update!",
        data: {},
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users data Updated successfully!",
        data: result.rows[0],
      });
    }
    // console.log(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `
            DELETE FROM users WHERE id = $1
            `,
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found for delete!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User delete successfully!",
    });

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found for delete!",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
