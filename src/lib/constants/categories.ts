export type CategoryId =
  | "accommodation"
  | "food"
  | "transport"
  | "activity"
  | "shopping"
  | "etc";

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  imgSrc: string;
}

export const CATEGORIES: Category[] = [
  { id: "accommodation", label: "숙소", emoji: "🏠", imgSrc: "/icons/category-accommodation.svg" },
  { id: "food", label: "식비", emoji: "🍽️", imgSrc: "/icons/category-food.svg" },
  { id: "transport", label: "교통", emoji: "🚌", imgSrc: "/icons/category-transport.svg" },
  { id: "activity", label: "액티비티", emoji: "🎯", imgSrc: "/icons/category-activity.svg" },
  { id: "shopping", label: "쇼핑", emoji: "🛍️", imgSrc: "/icons/category-shopping.svg" },
  { id: "etc", label: "기타", emoji: "➕", imgSrc: "/icons/category-etc.svg" },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;
