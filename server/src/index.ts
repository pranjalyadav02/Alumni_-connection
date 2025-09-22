import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || "demo",
  });
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Middleware to verify Firebase token
async function verifyToken(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Auth routes
app.post("/api/auth/verify", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Posts API
app.get("/api/posts", async (req, res) => {
  try {
    const db = getFirestore();
    const posts = await db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();
    const data = posts.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/api/posts", verifyToken, async (req, res) => {
  try {
    const db = getFirestore();
    const postData = {
      ...req.body,
      authorId: req.user.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      views: 0,
    };
    const docRef = await db.collection("posts").add(postData);
    res.json({ id: docRef.id, ...postData });
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// LinkedIn OAuth callback (REMOVE this route if LinkedIn integration is deprecated)
// app.get('/api/linkedin/callback', async (req, res) => {
//   try {
//     const { code, state } = req.query

//     // In production, exchange code for access token
//     // For demo, return mock data
//     res.json({
//       success: true,
//       profile: {
//         firstName: 'Demo',
//         lastName: 'User',
//         headline: 'Software Engineer',
//         email: 'demo@example.com'
//       }
//     })
//   } catch (error) {
//     res.status(500).json({ error: 'LinkedIn OAuth failed' })
//   }
// })

// Reports API
app.post("/api/reports", verifyToken, async (req, res) => {
  try {
    const db = getFirestore();
    const reportData = {
      ...req.body,
      reporterId: req.user.uid,
      createdAt: Date.now(),
      status: "pending",
    };
    const docRef = await db.collection("reports").add(reportData);
    res.json({ id: docRef.id, ...reportData });
  } catch (error) {
    res.status(500).json({ error: "Failed to create report" });
  }
});

// Admin routes
app.get("/api/admin/users", verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    const db = getFirestore();
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    const userData = userDoc.data();

    if (userData?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const users = await db.collection("users").get();
    const data = users.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/admin/reports", verifyToken, async (req, res) => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    const userData = userDoc.data();

    if (userData?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const reports = await db
      .collection("reports")
      .orderBy("createdAt", "desc")
      .get();
    const data = reports.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
