export const CATEGORIES = [
  "romantic",
  "emotional",
  "fun",
  "casual",
  "deep",
  "friendship",
  "late-night",
  "adventure",
  "flirty",
  "serious",
  "playful",
  "mystery",
  "travel",
  "gaming",
  "creative",
  "intellectual",
] as const;

export type CategoryName=(typeof CATEGORIES)[number]

const MAX_CATEGORY_COUNT=64
if(CATEGORIES.length>MAX_CATEGORY_COUNT){
    throw new Error(`Categories support up to ${MAX_CATEGORY_COUNT} bit positions,received ${CATEGORIES.length}`)
}
export const CATEGORY_MASKS=Object.freeze(
    Object.fromEntries(CATEGORIES.map((category,index)=>[category,(BigInt(1)<<BigInt(index)).toString()])) as Record<CategoryName,string>
)



























