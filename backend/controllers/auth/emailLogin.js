import bcrypt from 'bcrypt';
import prisma from '../../prismaClient.js';
import generateToken from '../../utils/generateToken.js';

const emailLogin = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Convert email to lowercase for case-insensitive comparison
    const lowercasedEmail = email.toLowerCase();

    // Check if user exists by email (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: lowercasedEmail },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Respond with success message and token
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || null,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default emailLogin;
