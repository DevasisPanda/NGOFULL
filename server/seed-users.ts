import "dotenv/config";
import { users, members } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "./auth";
import { getDb } from "./db";

async function generateSequentialMembershipNumber(db: any) {
  const result = await db.select({ membershipNumber: members.membershipNumber }).from(members);
  
  let maxNumber = 0;
  result.forEach((row: { membershipNumber: string | null }) => {
    if (row.membershipNumber && row.membershipNumber.startsWith("MBR-")) {
      const numPart = parseInt(row.membershipNumber.replace("MBR-", ""), 10);
      if (!isNaN(numPart) && numPart > maxNumber) {
        maxNumber = numPart;
      }
    }
  });

  return `MBR-${(maxNumber + 1).toString().padStart(4, "0")}`;
}

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    process.exit(1);
  }
  
  console.log("Seeding dummy data...");
  const pwHash = await hashPassword("password123");

  const dummyData = [
    {
      name: "Ravi Sharma",
      email: "admin_ravi@example.com",
      role: "admin",
      status: "active",
      fatherName: "Om Prakash Sharma",
      dob: new Date("1985-05-12"),
      aadharNumber: "123456789012",
      gender: "male",
      maritalStatus: "married",
      category: "General",
      bloodGroup: "O+",
      occupation: "NGO Director",
      address: "123 Green Valley, Admin Enclave",
      pinCode: "110001",
      state: "Delhi",
      city: "New Delhi",
      designation: "Admin",
      bio: "Dedicated to social welfare and leading operations at the NGO."
    },
    {
      name: "Priya Singh",
      email: "admin_priya@example.com",
      role: "admin",
      status: "active",
      fatherName: "Ranjit Singh",
      dob: new Date("1990-08-22"),
      aadharNumber: "987654321098",
      gender: "female",
      maritalStatus: "single",
      category: "General",
      bloodGroup: "A+",
      occupation: "Operations Manager",
      address: "45 Lotus Tower, Executive Block",
      pinCode: "110002",
      state: "Delhi",
      city: "New Delhi",
      designation: "Admin",
      bio: "Managing daily operations and admin tasks efficiently."
    },
    {
      name: "Amit Kumar",
      email: "member_amit@example.com",
      role: "user",
      status: "active",
      fatherName: "Suresh Kumar",
      dob: new Date("1995-02-15"),
      aadharNumber: "456712348901",
      gender: "male",
      maritalStatus: "single",
      category: "OBC",
      bloodGroup: "B+",
      occupation: "Software Engineer",
      address: "78 Tech Park Avenue",
      pinCode: "560001",
      state: "Karnataka",
      city: "Bangalore",
      designation: "Volunteer",
      bio: "Excited to contribute my tech skills to social causes."
    },
    {
      name: "Neha Gupta",
      email: "member_neha@example.com",
      role: "user",
      status: "pending",
      fatherName: "Rajesh Gupta",
      dob: new Date("1992-11-30"),
      aadharNumber: "321654987123",
      gender: "female",
      maritalStatus: "married",
      category: "General",
      bloodGroup: "AB+",
      occupation: "Teacher",
      address: "12 Education Colony",
      pinCode: "400001",
      state: "Maharashtra",
      city: "Mumbai",
      designation: "Educator",
      bio: "Passionate about child education and women empowerment."
    },
    {
      name: "Rahul Verma",
      email: "member_rahul@example.com",
      role: "user",
      status: "active",
      fatherName: "Vinod Verma",
      dob: new Date("1988-04-18"),
      aadharNumber: "741852963012",
      gender: "male",
      maritalStatus: "divorced",
      category: "SC",
      bloodGroup: "O-",
      occupation: "Social Worker",
      address: "89 Peace Layout",
      pinCode: "600001",
      state: "Tamil Nadu",
      city: "Chennai",
      designation: "Field Coordinator",
      bio: "Working on the ground to deliver direct assistance to communities."
    },
    {
      name: "Kiran Bedi",
      email: "admin_kiran@example.com",
      role: "admin",
      status: "active",
      fatherName: "Prakash Bedi",
      dob: new Date("1975-09-10"),
      aadharNumber: "112233445566",
      gender: "female",
      maritalStatus: "married",
      category: "General",
      bloodGroup: "B-",
      occupation: "Chief Administrator",
      address: "101 Governance Road",
      pinCode: "110003",
      state: "Delhi",
      city: "New Delhi",
      designation: "Admin",
      bio: "Overseeing all administrative boundaries and ensuring compliance."
    },
    {
      name: "Sanjay Dutt",
      email: "member_sanjay@example.com",
      role: "user",
      status: "pending",
      fatherName: "Sunil Dutt",
      dob: new Date("1982-12-05"),
      aadharNumber: "998877665544",
      gender: "male",
      maritalStatus: "married",
      category: "General",
      bloodGroup: "A-",
      occupation: "Business Owner",
      address: "55 Commerce Street",
      pinCode: "400002",
      state: "Maharashtra",
      city: "Mumbai",
      designation: "Sponsor",
      bio: "Looking to sponsor events and help the community grow."
    }
  ];

  for (const user of dummyData) {
    try {
      await db.insert(users).values({
        ...user,
        role: user.role as "admin" | "user" | "staff" | "volunteer",
        status: user.status as "active" | "inactive" | "blocked" | "pending",
        gender: user.gender as "male" | "female" | "other",
        maritalStatus: user.maritalStatus as "single" | "married" | "divorced" | "widowed" | undefined,
        category: user.category as "General" | "OBC" | "SC" | "ST" | "Other" | undefined,
        passwordHash: pwHash,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date()
      });
      
      const insertedUserList = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
      const insertedUser = insertedUserList[0];

      console.log(`Inserted user: ${insertedUser.email}`);

      if (user.role === "user") {
        const memNum = await generateSequentialMembershipNumber(db);
        await db.insert(members).values({
          userId: insertedUser.id,
          membershipNumber: memNum,
          membershipType: "regular",
          status: user.status === "active" ? "active" : "pending",
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Inserted membership for user: ${insertedUser.email} with number ${memNum}`);
      }
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        console.log(`User ${user.email} already exists, skipping.`);
      } else {
        console.error(`Error inserting ${user.email}:`, e);
      }
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});

