import prisma from "../../prismaClient.js";

const getDashboardInfo = async (req, res) => {
  try {
    const user = req.user; // The user object is already attached via the middleware

    // Fetch user with relevant data
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        ownedProjects: true,   // User's owned projects
        challenges: true,      // Challenges completed by the user
        streaks: true,         // Streak data for daily/weekly streak
      }
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate streak data (e.g., daily or weekly)
    const streak = userData.streaks.length > 0
      ? userData.streaks.sort((a, b) => b.lastActive - a.lastActive)[0] // Get the latest streak
      : null;

    // Profile data (name, avatar, streak)
    const userProfile = {
      id: userData.id,
      name: userData.name,
      profilePicture: userData.profilePicture || "/default-avatar.png",
      streakCount: streak ? streak.streakCount : 0,
      streakIcon: streak ? "/fire-icon.png" : "/default-icon.png",
    };

    // Dashboard sections
    const dashboard = {
      userProfile,
      projects: userData.ownedProjects, // List of projects
      challenges: userData.challenges, // List of challenges (bug-fix or otherwise)
      streakInfo: streak,             // The most recent streak
    };

    res.json({ dashboard });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

export default getDashboardInfo;
