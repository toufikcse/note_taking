import mongoose from 'mongoose';
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

  async getUsers(
    query: { query: any },
    skip: number,
    limit: number,
  ): Promise<{ users: any[]; total: number }> {
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments(query),
    ]);
    return { users, total };
  }

  async findUserById(id: string) {
    const user = await User.findById(id).select('-password');
    return user;
  }

  async updateUser(id: string, user: any) {
    const updateData: any = {};
    if (user.name) updateData.name = user.name;
    if (user.role) updateData.role = user.role;
    if (user.interests) updateData.interests = user.interests;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    }).select('-password');
    return updatedUser;
  }

  async deleteUser(id: string) {
    return await User.findByIdAndDelete(id);
  }

  async groupByInterests() {
    const result = await User.aggregate([
      { $unwind: '$interests' },
      {
        $group: {
          _id: '$interests',
          users: { $push: { _id: '$_id', name: '$name', email: '$email' } },
          userCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // sort by interest name
    ]);
    return result;
  }

  async getUserNotes(id: string) {
    const data = await User.aggregate([
      // Step 1: Match the user
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },

      // Step 2: Join with notes collection
      {
        $lookup: {
          from: 'notes', // collection name
          localField: '_id', // User._id
          foreignField: 'userId', // Note.userId
          as: 'notes',
        },
      },

      // Step 3: Shape response (optional but clean)
      {
        $project: {
          name: 1,
          email: 1,
          notes: 1,
        },
      },
    ]);

    return data;
  }
}

export default new UserService();
