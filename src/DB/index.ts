import { Pool } from "pg";
import config from "../config/env";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  try {
    //role VARCHAR(10) DEFAULT 'user', ai line mane jodi role field vul kore na dii taile default vabe user hishbe set 
    //hoe jabe
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(20) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        role VARCHAR(10) DEFAULT 'user', 

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
            `);

    await pool.query(`
              CREATE TABLE IF NOT EXISTS profiles(
              id SERIAL PRIMARY KEY,
              user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,

              bio TEXT,
              address TEXT,
              phone VARCHAR(15),
              gender VARCHAR(10),

              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
              )
              `);
    console.log("database connected Successfully!");
  } catch (error) {
    console.log(error);
  }
};
