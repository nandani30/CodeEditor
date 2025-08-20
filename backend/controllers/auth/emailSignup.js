import prisma from "../../prismaClient.js";
import bcrypt from 'bcrypt'
import generateToken from "../../utils/generateToken.js"
import nodemailer from "nodemailer"

const createEmailTransport = () => {
    try{
        const transport = nodemailer.createTransport({
            service: "gmail",
            host : "smtp.gmail.com",
            port: 587,
            secure : false,
            auth: {
                user : process.env.GMAIL_SENDER_EMAIL,
                pass : process.env.GMAIL_APP_PASSWORD,
            }
        })

        console.log('Gmail transport created successfully')
        return transport
    }
    catch(err){
        console.log(`Failed to create Gmail transport : ${err}`)
        return null
    }
}

export const sendOtpHandler = async (req,res) => {
    const {email} = req.body;
    if(!email) return res.status(400).json({message : 'Email is required'});
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try{
        //if user exists
        const existingUser = await prisma.user.findFirst({
            where: {email}
        });
        if(existingUser)
            return res.status(400).json({ message: "A User with this email already exists"});

        //if user doesn't exist
        await prisma.emailOtp.delete({
            where : {email}
        });
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        //create otp
        await prisma.emailOtp.create({
            data : {
                email,
                otp,
                expiresAt,
            }
        });

        //initialize transport
        const transport = createEmailTransport();

        if(!transport){
            console.log(`Couldn't generate transport for sending otp. otp for ${email} is ${otp}`);
            return res.status(200).json({
                message : "Couldn't send otp, please try again later"
            });
        }

        //sending email 
        try{
            const mailOptions = {
                from: {
                  name: "CodeAura",
                  address: process.env.GMAIL_SENDER_EMAIL,
                },
                to: email,
                subject: "🔐 Verify Your CodeAura Account",
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>CodeAura Verification Code</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #0f0f10; color: #e5e7eb;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #18181b; border-radius: 12px; border: 1px solid #27272a;">
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 28px;">
                      <h1 style="color: #f4f4f5; margin: 0; font-size: 26px; font-weight: 700;">Welcome to CodeAura</h1>
                      <p style="color: #a1a1aa; margin-top: 8px; font-size: 15px;">Your AI-powered collaborative code editor</p>
                    </div>
              
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #1e1e22, #2a2a2f); border-radius: 10px; padding: 24px; text-align: center; border: 1px solid #3f3f46;">
                      <p style="color: #a1a1aa; font-size: 15px; margin-bottom: 12px;">Use this verification code to continue:</p>
                      <div style="background: linear-gradient(135deg, #27272a, #3f3f46); border: 2px solid #4f46e5; border-radius: 8px; padding: 20px; font-size: 36px; font-weight: bold; color: #818cf8; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${otp}
                      </div>
                      <p style="color: #f87171; font-size: 13px; margin-top: 16px;">⏳ This code will expire in 5 minutes</p>
                    </div>
              
                    <!-- Security Note -->
                    <div style="background: rgba(234,179,8,0.08); border-left: 4px solid #facc15; padding: 14px; margin: 20px 0; border-radius: 6px;">
                      <p style="color: #facc15; margin: 0; font-size: 14px;">
                        <strong>🔒 Security Tip:</strong> If you didn’t request this, ignore this email. Your account stays safe.
                      </p>
                    </div>
              
                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 28px; padding-top: 16px; border-top: 1px solid #27272a;">
                      <p style="color: #52525b; font-size: 12px; margin: 0;">
                        &copy; ${new Date().getFullYear()} CodeAura — Secure. Simple. Smart.
                      </p>
                    </div>
                  </div>
                </body>
                </html>
                `,
                text: `
              Welcome to CodeAura!
              
              Your verification code is: ${otp}
              
              This code will expire in 5 minutes.
              
              If you didn't request this, please ignore this email.
              
              - CodeAura Team
                `,
              };
              
        
              // Send the email
              const emailResult = await transport.sendMail(mailOptions)
        
              console.log(` Email sent successfully to ${email}`)
              console.log(` Message ID:`, emailResult.messageId)
              console.log(` OTP: ${otp}`)
        
              res.status(200).json({
                message: "OTP sent successfully to your email! Please check your inbox and spam folder.",
                messageId: emailResult.messageId,
              })

        }
        catch(err){
            console.log(`Failed to sent otp email to ${email}`)

            res.status(200).json({
                message : `Failed to sent otp for email ${email}`,
            })
        }

    }
    catch(err){
        res.status(500).json({ message: "Failed to send OTP", error: err.message })
    }
    
} 

// Verify OTP + Signup
export const verifyOtpHandler = async (req, res) => {
    const { email, otp, password } = req.body
  
    if (!email || !otp || !password) {
      return res.status(400).json({ message: "All credentials are required" })
    }
    
    const lowercasedEmail = email.toLowerCase();

    try {
      // Find valid OTP
      const validOtp = await prisma.emailOtp.findFirst({
        where : {lowercasedEmail},
      })
      if (!validOtp) {
        return res.status(400).json({ message: "Invalid or expired OTP" })
      }
  
      if (otp !== validOtp.otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" })
      }

      if (new Date(validOtp.expiresAt) < new Date()) {
        return res.status(400).json({ message: 'OTP has expired' });
      }
  
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where : { lowercasedEmail }
      })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists. Please sign in instead." })
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)
      const name = lowercasedEmail.split('@')[0];
  
      // Create user
      const user = await prisma.user.create({
        data : {
            email : lowercasedEmail,
            name,
            password: hashedPassword,
        }
      })
  
      // Clean up OTP
      await prisma.emailOtp.delete({
        where : { lowercasedEmail}
      })
  
      // Generate token with full user object
      const token = generateToken(user)
  
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          name :  user.name
        },
      })
    } catch (err) {
      console.error("Verify OTP Error:", err)
      res.status(500).json({ message: "Registration failed", error: err.message })
    }
  }



