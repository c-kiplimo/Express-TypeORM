import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { UserResponse } from "../controllers/dto/user.dto";

export class UserController {
  static async signup(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const { user, token } = await UserService.createUser(name, email, password, role);

      const userDataSent = new UserResponse();
      userDataSent.name = user.name;
      userDataSent.email = user.email;
      userDataSent.role = user.role;

      return res.status(200).json({ message: "User created successfully", token, user: userDataSent });
    } catch (error) {
      console.error("Error during user creation:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getUsers();

      return res.status(200).json({
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const updatedUser = await UserService.updateUser(id, name, email);

      if (updatedUser) {
        return res.status(200).json({ message: "Update successful", user: updatedUser });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const isDeleted = await UserService.deleteUser(id);

      if (isDeleted) {
        return res.status(200).json({ message: "User deleted successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

}