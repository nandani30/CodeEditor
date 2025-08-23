import prisma from "../../prismaClient.js";

const getUserInfo = async (req, res) => {
  try {
    const user = req.user;  // The user object is already attached via the middleware

    // Fetch user with streaks, challenges, and owned projects
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        streaks: true,       // Include streak data
        challenges: true,    // Include challenges completed
        ownedProjects: true  // Include projects owned by the user
      }
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the streak count:
    // If streaks exist, get the latest streak or default to 0 if no streak is found
    let streakCount = 0;
    if (userData.streaks.length > 0) {
      // If you want the most recent streak, you can sort by `lastActive`
      const latestStreak = userData.streaks.sort((a, b) => b.lastActive - a.lastActive)[0];
      streakCount = latestStreak.streakCount; // You can filter for daily or weekly streaks if needed
    }

    // Challenges completed count
    const challengesCompleted = userData.challenges.length;

    // Gather other data for the profile view
    const userProfile = {
      id: userData.id,
      name: userData.name,
      profilePicture: userData.profilePicture, // Handle absence of profilePicture on frontend
      streakCount, // This can be updated based on the latest streak or a default
      challengesCompleted, // Total challenges completed
      ownedProjects: userData.ownedProjects.length, // Total owned projects
    };

    // Send the response with user profile data
    res.json({ user: userProfile });

  } catch (error) {
    // Send an error response with message and error details
    console.error("Error fetching user data:", error);  // Log error for debugging
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

export default getUserInfo;
