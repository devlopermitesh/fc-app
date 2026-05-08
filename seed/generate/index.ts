import { seedCategories } from "@/seed/generate/category.generate";

async function main() {
  const result = await seedCategories();

  console.log(`Seeded ${result.total} categories into redis hash "${result.key}".`);
  console.table(result.categories);
}

main().catch((error) => {
  console.error("Failed to seed categories:", error);
  process.exit(1);
});
