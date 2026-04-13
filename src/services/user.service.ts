import User from '../models/user.model';

export class UserService {
  async findUserByEmail(email: string) {
    const user = await User.findOne({ email }).select('+password');
    return user;
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    interests: string[],
  ) {
    const user = await User.create({
      name,
      email,
      password,
      interests: interests || [],
    });
    return user;
  }
}

export default new UserService();
