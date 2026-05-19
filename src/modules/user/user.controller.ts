import type { Request, Response } from "express";
import { pool } from "../../DB";
import { userService } from "./user.service";

//user posting:
const createUser = async (req: Request, res: Response) => {
  // console.log(req.body);
//   const { name, email, password, age } = req.body;

  try {
    const result = await userService.createUserIntoDB(req.body);
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
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();
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
};

//get Users by ID:
const getSingleUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await userService.getSingleUserFromDB(id as string);
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
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const { name, email, password, age, is_active } = req.body;
    // console.log(id, {name, password, age, is_active});
    const result = await userService.updateUserFromDB(req.body, id as string);
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
}

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await userService.deleteUserFromDB(id as string);

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
}

export const userController = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser
}
