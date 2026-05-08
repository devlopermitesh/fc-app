import {redis}from "@/lib/redis"
import { CATEGORIES, CATEGORY_MASKS } from "@/seed/constant/category.constant";

const CATEGORY_HASH_KEY = "categories";

export async function seedCategories() {
  await redis.del(CATEGORY_HASH_KEY);
  await redis.hset(CATEGORY_HASH_KEY, CATEGORY_MASKS);

  return {
    key: CATEGORY_HASH_KEY,
    total: CATEGORIES.length,
    categories: CATEGORY_MASKS,
  };
}
