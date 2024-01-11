import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { encrypt } from "../utils/encrypt";

export class AuthService {
  static async loginUser(email: string, password: string): Promise<{ user: User | null; token?: string }> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!email || !password || !user) {
      return null;
    }

    const isPasswordValid = encrypt.comparepassword(user.password, password);
    if (!isPasswordValid) {
      return null;
    }

    const token = encrypt.generateToken({ id: user.id });
    return { user, token };
  }

  static async getProfile(userId: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    return user;
  }
}