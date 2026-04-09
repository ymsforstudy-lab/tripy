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
  {
    id: "accommodation",
    label: "숙소",
    emoji: "🏠",
    imgSrc:
      "https://www.figma.com/api/mcp/asset/45103305-949d-4576-b558-50861414ce5c",
  },
  {
    id: "food",
    label: "식비",
    emoji: "🍽️",
    imgSrc:
      "https://www.figma.com/api/mcp/asset/b1415350-0dd1-44e3-9110-0fb497bbd7d7",
  },
  {
    id: "transport",
    label: "교통",
    emoji: "🚌",
    imgSrc:
      "https://www.figma.com/api/mcp/asset/a98003b6-fc39-4bfe-937d-a12f6085e2f2",
  },
  {
    id: "activity",
    label: "액티비티",
    emoji: "🎯",
    imgSrc:
      "https://www.figma.com/api/mcp/asset/449e43b9-e6c7-4b12-9337-19f5945f9842",
  },
  {
    id: "shopping",
    label: "쇼핑",
    emoji: "🛍️",
    imgSrc:
      "https://www.figma.com/api/mcp/asset/d6f18ed8-ec39-437a-b59f-572c5d306e1c",
  },
  {
    id: "etc",
    label: "기타",
    emoji: "➕",
    imgSrc:
      "https://www.figma.com/api/mcp/asset/b5406cd4-0c27-4425-b37c-d4b307cf1d7a",
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;
