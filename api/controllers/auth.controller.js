import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters long!" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long!" });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address!" });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists!" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists!" });
      }
    }

    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user with:", { username, email });

    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log("User created successfully:", newUser.id);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log("Registration error:", err);
    
    // Handle specific Prisma errors
    if (err.code === 'P2002') {
      if (err.meta?.target?.includes('email')) {
        return res.status(400).json({ message: "Email already exists!" });
      }
      if (err.meta?.target?.includes('username')) {
        return res.status(400).json({ message: "Username already exists!" });
      }
    }
    
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // CHECK IF THE PASSWORD IS CORRECT

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER

    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    console.log("Setting cookie for user:", userInfo.username);
    
    // Try multiple cookie configurations for better compatibility
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: age,
      path: '/'
    };
    
    console.log("Cookie settings:", cookieOptions);
    
    // Set the cookie
    res.cookie("token", token, cookieOptions);
    
    // Also set a backup cookie with different settings
    res.cookie("token_backup", token, {
      httpOnly: false, // Not httpOnly so JS can access it
      secure: true,
      sameSite: 'lax', // More permissive
      maxAge: age,
      path: '/'
    });
    
    res.status(200).json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // The verifyToken middleware already verified the token and set req.userId
    // Now we need to get the user data
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("Token verification error:", err);
    res.status(500).json({ message: "Token verification failed!" });
  }
};

export const logout = (req, res) => {
  // Clear both cookies
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  
  res.clearCookie("token_backup", {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });
  
  res.status(200).json({ message: "Logout Successful" });
};