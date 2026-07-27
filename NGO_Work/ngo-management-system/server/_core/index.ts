import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { razorpayWebhookRouter } from "../routes/webhooks";

import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  
  // Enable 'trust proxy' so express-rate-limit gets real IP behind Render proxy
  app.set("trust proxy", 1);
  
  // Use Helmet for basic security headers (permissive CSP for CDN media compatibility)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false, // Required for Razorpay payment popup (bank simulation)
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      xFrameOptions: { action: "sameorigin" },
    })
  );

  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map(o => o.trim().replace(/\/$/, ""))
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://valmikisamajcharitabletrust.org",
        "https://www.valmikisamajcharitabletrust.org",
        "https://admin.valmikisamajcharitabletrust.org",
      ].map(o => o.replace(/\/$/, ""));
  
  // In production, strictly match allowed origins
  if (process.env.NODE_ENV === "production" || process.env.RENDER) {
    app.use(cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        const normalizedOrigin = origin.trim().replace(/\/$/, "");
        
        // Match exact or wildcard patterns
        const isAllowed = allowedOrigins.some(allowed => {
          if (allowed === normalizedOrigin) return true;
          if (allowed.includes('*')) {
            const regex = new RegExp('^' + allowed.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
            return regex.test(normalizedOrigin);
          }
          return false;
        });

        // Automatically allow any vercel.app or onrender.com domains for preview/internal deployments
        const isVercelPreview = normalizedOrigin.endsWith(".vercel.app");
        const isRenderInternal = normalizedOrigin.endsWith(".onrender.com");

        if (isAllowed || isVercelPreview || isRenderInternal) {
          return callback(null, true);
        }

        console.warn(`[CORS Blocked] Request from origin "${origin}" was rejected. Allowed origins are:`, allowedOrigins);
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }));
  } else {
    app.use(cors({
      origin: true,
      credentials: true,
    }));
  }
  const server = createServer(app);
  
  // Configure body parser with 10MB limit for base64 image uploads
  app.use(
    express.json({
      limit: "10mb",
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString();
      },
    })
  );
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  
  // Webhooks Router
  app.use("/api/webhooks/razorpay", razorpayWebhookRouter);
  
  // Rate Limiting has been disabled to ensure smooth logins and prevent proxy IP mismatch blocks
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
