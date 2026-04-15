import jwt from 'jsonwebtoken';

export const generateToken = (user: any) => {
  // console.log('Generating token for user:', user);
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
};
