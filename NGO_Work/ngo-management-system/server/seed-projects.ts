import { getDb } from "./db";
import { projects } from "../drizzle/schema";

async function seed() {
  console.log("Seeding projects...");
  const db = await getDb();
  if (!db) throw new Error("DB connection failed");

  const initialProjects = [
    {
      title: "Dream Project",
      description: "Paradise Child Home, Modasa is the dream project of Valmiki Samaj Charitable Trust, dedicated to providing orphaned and vulnerable children with a safe home, quality education, healthcare, and holistic development in a world-class environment.\nIts mission is to empower every child with protection, dignity, life skills, and equal opportunities to build a bright, independent, and successful future.",
      image: "Dream_Project.jpeg",
      status: "active" as const,
    },
    {
      title: "Celebration",
      description: "Celebrate your special occasions by bringing joy to 500 orphaned and underprivileged children at Paradise Child Home, Modasa, through meaningful support and acts of kindness.\nTurn your happiness into hope by sponsoring their meals, education, and care, creating lasting smiles and a brighter future for every child.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
      status: "active" as const,
    },
    {
      title: "Wings of Hope",
      description: "Wings of Hope empowers orphaned and underprivileged children through education, mentorship, healthcare, and emotional support, helping them achieve their dreams with confidence and dignity.\nEvery contribution gives a child the opportunity to learn, grow, and build a brighter, self-reliant future filled with hope and possibilities.",
      image: "Wings.jpeg",
      status: "active" as const,
    }
  ];

  for (const project of initialProjects) {
    await db.insert(projects).values(project);
  }

  console.log("Projects seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding projects:", err);
  process.exit(1);
});
