import jwt from "jsonwebtoken"

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      name : user.name,
      email: user.email,
      profilePicture: user.profilePicture || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  )
}

export default generateToken