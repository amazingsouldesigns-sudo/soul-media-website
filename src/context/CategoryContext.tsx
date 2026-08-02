import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProjectHref, isValidCategorySlug } from "@/lib/categories";
import {
  clearStoredCategory,
  getStoredCategory,
  setStoredCategory,
} from "@/lib/selectedCategory";

type CategoryContextValue = {
  selectedCategory: string | null;
  projectHref: string;
  setSelectedCategory: (slug: string) => void;
  clearSelectedCategory: () => void;
};

const CategoryContext = createContext<CategoryContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(() => {
    const stored = getStoredCategory();
    return stored && isValidCategorySlug(stored) ? stored : null;
  });

  const setSelectedCategory = useCallback((slug: string) => {
    if (!isValidCategorySlug(slug)) return;
    setStoredCategory(slug);
    setSelectedCategoryState(slug);
  }, []);

  const clearSelectedCategory = useCallback(() => {
    clearStoredCategory();
    setSelectedCategoryState(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedCategory,
      projectHref: getProjectHref(selectedCategory),
      setSelectedCategory,
      clearSelectedCategory,
    }),
    [selectedCategory, setSelectedCategory, clearSelectedCategory]
  );

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  );
}

export function useCategory(): CategoryContextValue {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error("useCategory must be used within CategoryProvider");
  }
  return ctx;
}
