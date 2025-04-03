import React, { useState, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import WallpaperCard from "./WallpaperCard";
import LoadingSkeleton from "./LoadingSkeleton";
import {
  WallpaperItem,
  getRandomPhotos,
  getPhotosByCategory,
} from "../services/unsplash";

interface WallpaperGridProps {
  title?: string;
  wallpapers: WallpaperItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  category?: string;
  onFavoriteToggle?: (id: string) => void;
  onNewWallpapers?: (wallpapers: WallpaperItem[]) => void;
}

interface ErrorState {
  message: string;
  retry: () => void;
}

const WallpaperGridNew = ({
  title = "Trending Wallpapers",
  wallpapers,
  isLoading = false,
  onEndReached = () => {},
  category = "",
  onFavoriteToggle,
  onNewWallpapers,
}: WallpaperGridProps) => {
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState<ErrorState | null>(null);
  
  const uniqueWallpapers = useMemo(() => {
    return wallpapers.filter(
      (wallpaper, index, self) =>
        index === self.findIndex((w) => w.id === wallpaper.id)
    );
  }, [wallpapers]);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();

  // Handle initial load if no wallpapers provided
  useEffect(() => {
    if (!wallpapers?.length) {
      fetchWallpapers();
    }
  }, []);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && !loading) {
      setPage((prev) => prev + 1);
      onEndReached();
    }
  }, [inView, loading]);

  const fetchWallpapers = async () => {
    setLoading(true);
    setError(null);
    try {
      let photos;
      if (category) {
        photos = await getPhotosByCategory(category);
      } else {
        photos = await getRandomPhotos(20);
      }
      if (onNewWallpapers) {
        onNewWallpapers(photos);
      }
    } catch (err) {
      setError({
        message: `Failed to load wallpapers: ${err instanceof Error ? err.message : String(err)}`,
        retry: fetchWallpapers
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (id: string) => {
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {title}
        </h2>
      )}

      {(loading || isLoading) && uniqueWallpapers.length === 0 ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {uniqueWallpapers.map((wallpaper, index) => (
            <WallpaperCard
              key={`${wallpaper.id}-${index}`}
              id={wallpaper.id}
              imageUrl={wallpaper.imageUrl}
              title={wallpaper.title}
              isFavorite={wallpaper.isFavorite || false}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
          <div ref={ref} className="h-2 w-full" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-800">{error.message}</p>
          <button 
            onClick={error.retry}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default WallpaperGridNew;