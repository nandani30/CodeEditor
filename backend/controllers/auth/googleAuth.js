import prisma from '../../prismaClient.js'
import generateToken from "../../utils/generateToken.js"

const getGoogleClient = async () => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn("Google OAuth credentials missing")
      return null
    }

    console.log("Google Client ID found:", process.env.GOOGLE_CLIENT_ID.substring(0, 20) + "...")

    const { OAuth2Client } = await import("google-auth-library")
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.SERVER_URL}/auth/google/callback`,
    )

    console.log("Google OAuth client initialized successfully")
    return client
  } catch (error) {
    console.error("Failed to initialize Google OAuth client:", error.message)
    return null
  }
}

//Google Auth redirect - FIXED to force account selection
export const googleAuthRedirect = async (req, res) => {
  const client = await getGoogleClient()

  if (!client) {
    console.error("Google OAuth not configured")
    return res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Google OAuth Not Configured</h2>
          <p>Please check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.</p>
          <a href="http://localhost:5173/signin">← Back to Sign In</a>
        </body>
      </html>
    `)
  }

  const redirectUrl = req.query.redirect || "http://localhost:5173/auth/callback"

  try {
    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: ["profile", "email"],
      redirect_uri: `${process.env.SERVER_URL}/auth/google/callback`,
      state: redirectUrl,
      //  FORCE Google to show account selection every time
      prompt: "select_account",
      include_granted_scopes: true,
    })

    console.log("Redirecting to Google OAuth with account selection")
    res.redirect(authUrl)
  } catch (error) {
    console.error("Error generating auth URL:", error)
    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>OAuth Error</h2>
          <p>Failed to generate authentication URL: ${error.message}</p>
          <a href="http://localhost:5173/signin">← Back to Sign In</a>
        </body>
      </html>
    `)
  }
}

//Google OAuth callback - DIRECT redirect without intermediate page
export const googleAuthCallback = async (req, res) => {
  const client = await getGoogleClient()

  if (!client) {
    return res.redirect(`http://localhost:5173/signin?error=oauth_not_configured`)
  }

  const { code, state, error } = req.query
  const redirectUrl = state || "http://localhost:5173/dashboard"

  if (error) {
    console.error("Google OAuth error:", error)
    return res.redirect(`http://localhost:5173/signin?error=oauth_denied`)
  }

  if (!code) {
    console.error("No authorization code received")
    return res.redirect(`http://localhost:5173/signin?error=no_code`)
  }

  try {
    console.log("Exchanging code for tokens...")
    const { tokens } = await client.getToken({
      code,
      redirect_uri: `${process.env.SERVER_URL}/auth/google/callback`,
    })

    console.log("Verifying ID token...")
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { email, given_name, family_name, picture } = payload

    console.log("Google user:", { email, given_name, family_name })

    let user = await prisma.user.findUnique({
        where : {email}
    })
    if (!user) {
      console.log("Creating new user...")
      user = await prisma.user.create({
        data: {
          email,
          name: `${given_name} ${family_name}` || "User",
          profilePicture: picture || null,
        }
      })
      
    } else {
      console.log("Existing user found")
      // Update profile picture if it exists
      if (picture && !user.profilePicture) {
        user.profilePicture = picture
      }
    }

    // Generate token with full user object
    const token = generateToken(user)

    console.log("Redirecting directly to dashboard with token")

    // DIRECT redirect to dashboard with token in URL
    // The frontend will handle storing the token
    res.redirect(`${redirectUrl}?token=${token}&auth=google`)
  } catch (err) {
    console.error("Google Auth Error:", err.message)
    res.redirect(`http://localhost:5173/signin?error=auth_failed`)
  }
}