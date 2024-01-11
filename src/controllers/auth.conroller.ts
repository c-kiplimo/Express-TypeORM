import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const authResult = await AuthService.loginUser(email, password);

      if (!authResult) {
        return res.status(404).json({ message: "Invalid email or password" });
      }

      const { user, token } = authResult;
      return res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      if (!req["currentUser"]) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req["currentUser"].id;
      const user = await AuthService.getProfile(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Omitting the password from the response
      const { password, ...userData } = user;
      return res.status(200).json(userData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}