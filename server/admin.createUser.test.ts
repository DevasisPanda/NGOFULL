import "dotenv/config";
import { describe, expect, it, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { users, members } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import type { TrpcContext } from "./_core/context";

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 999999, // dummy admin ID
      openId: "test-admin",
      email: "testadmin@example.com",
      name: "Test Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("admin.createUser (Add Member)", () => {
  const testEmail = `test_member_${Date.now()}@example.com`;
  let createdUserId: number | null = null;

  afterAll(async () => {
    const db = await getDb();
    if (db && createdUserId) {
      // Clean up the created member and user
      await db.delete(members).where(eq(members.userId, createdUserId));
      await db.delete(users).where(eq(users.id, createdUserId));
    }
  });

  it("successfully creates a new user and active membership", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.createUser({
      name: "Test Add Member User",
      email: testEmail,
      phone: "+919876543210",
      password: "securepassword123",
      membershipType: "regular",
    });

    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
    expect(result.membershipNumber).toMatch(/^MBR-\d+$/);

    createdUserId = result.userId;

    // Verify it exists in database
    const db = await getDb();
    expect(db).toBeDefined();
    if (db) {
      const userRows = await db.select().from(users).where(eq(users.id, createdUserId)).limit(1);
      expect(userRows).toHaveLength(1);
      expect(userRows[0].email).toBe(testEmail);
      expect(userRows[0].role).toBe("user");
      expect(userRows[0].status).toBe("active");

      const memberRows = await db.select().from(members).where(eq(members.userId, createdUserId)).limit(1);
      expect(memberRows).toHaveLength(1);
      expect(memberRows[0].membershipNumber).toBe(result.membershipNumber);
      expect(memberRows[0].status).toBe("active");
    }
  });
});
