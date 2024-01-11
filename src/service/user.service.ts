import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { encrypt } from "../utils/encrypt";
import * as cache from "memory-cache";

export class UserService {
  static async createUser(name: string, email: string, password: string, role: string): Promise<{ user: User; token: string }> {
    const encryptedPassword = await encrypt.encryptpass(password);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = encryptedPassword;
    user.role = role;

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);

    const token = encrypt.generateToken({ id: user.id });

    return { user, token };
  }
static async getUsers(): Promise<User[]> {
    const data = cache.get("data");
    
    if (data) {
        console.log("serving from cache");
        return data;
    } else {
        console.log("serving from db");
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();

        cache.put("data", users, 6000);
        return users;
    }
}
static async updateUser(id: string, name: string, email: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (user) {
      user.name = name;
      user.email = email;
      await userRepository.save(user);
      return user;
    } else {
      return null; // Indicate that the user with the provided ID was not found
    }
  }
  static async deleteUser(id: string): Promise<boolean> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (user) {
      await userRepository.remove(user);
      return true; 
    } else {
      return false;
    }
  }
}