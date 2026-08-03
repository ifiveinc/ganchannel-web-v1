import { useCallback, useEffect, useState } from "react";
import { readFavorites, writeFavorites } from "~/lib/favorites-storage";

// お気に入りの読み書き。
// SSRとクライアントで初期描画を一致させるため、初期stateは必ず空配列にして
// useEffect の中で読み込む（docs/circle-info/spec.md §4）。
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFavoriteIds(readFavorites());
    setIsLoaded(true);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((current) => {
      const next = current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id];

      writeFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  return { favoriteIds, isFavorite, toggleFavorite, isLoaded };
}
