// Unsplash API service

// Use a different API key as the previous one might be rate limited or invalid
// Try both Expo and Node.js environment variable formats
const UNSPLASH_API_KEY = 
  process.env.EXPO_PUBLIC_UNSPLASH_API_KEY || 
  process.env.UNSPLASH_API_KEY ||
  "4do3bAghues3HWTjWQT_b41L6lThYhN-CpW9bVf_P-E"; // fallback for testing

if (!UNSPLASH_API_KEY) {
  console.warn('Warning: Using fallback Unsplash API key');
}
const UNSPLASH_API_URL = "https://api.unsplash.com";

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
  };
}

export interface WallpaperItem {
  id: string;
  imageUrl: string;
  title: string;
  isFavorite: boolean;
  category?: string;
  author?: string;
  downloadUrl?: string;
}

// Convert Unsplash photo to our app's wallpaper format
export const mapUnsplashToWallpaper = (
  photo: UnsplashPhoto,
): WallpaperItem => ({
  id: photo.id,
  imageUrl: photo.urls.regular,
  title: photo.alt_description || photo.description || "Untitled Wallpaper",
  isFavorite: false,
  author: photo.user.name,
  downloadUrl: photo.urls.full,
});

// Fetch random photos
export const getRandomPhotos = async (count = 10): Promise<WallpaperItem[]> => {
  try {
    // First try with the API
    try {
      // Add a cache-busting parameter to ensure we get different images each time
      const timestamp = Date.now();
      const response = await fetch(
        `${UNSPLASH_API_URL}/photos/random?count=${count}&_t=${timestamp}`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const photos: UnsplashPhoto[] = await response.json();
      // Ensure we have unique photos by ID
      const uniquePhotos = photos.filter(
        (photo, index, self) =>
          index === self.findIndex((p) => p.id === photo.id),
      );
      return uniquePhotos.map(mapUnsplashToWallpaper);
    } catch (apiError) {
      console.error("Error fetching from API, using fallback data:", apiError);
      // Fallback to static data if API fails
      return [
        {
          id: "photo-1",
          imageUrl:
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
          title: "Abstract Wave",
          isFavorite: false,
          category: "Abstract",
          author: "Unsplash",
        },
        {
          id: "photo-2",
          imageUrl:
            "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80",
          title: "Nature Landscape",
          isFavorite: false,
          category: "Nature",
          author: "Unsplash",
        },
        {
          id: "photo-3",
          imageUrl:
            "https://images.unsplash.com/photo-1516617442634-75371039cb3a?w=400&q=80",
          title: "Minimal Dark",
          isFavorite: false,
          category: "Minimal",
          author: "Unsplash",
        },
        {
          id: "photo-4",
          imageUrl:
            "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=400&q=80",
          title: "Urban Scene",
          isFavorite: false,
          category: "Urban",
          author: "Unsplash",
        },
        {
          id: "photo-5",
          imageUrl:
            "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80",
          title: "Space Galaxy",
          isFavorite: false,
          category: "Space",
          author: "Unsplash",
        },
        {
          id: "photo-6",
          imageUrl:
            "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80",
          title: "Neon Lights",
          isFavorite: false,
          category: "Neon",
          author: "Unsplash",
        },
      ];
    }
  } catch (error) {
    console.error("Error fetching random photos:", error);
    return [];
  }
};

// Search photos by query
export const searchPhotos = async (
  query: string,
  page = 1,
  perPage = 20,
): Promise<{ results: WallpaperItem[]; total: number }> => {
  try {
    // First try with the API
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(
          query,
        )}&page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        results: data.results.map(mapUnsplashToWallpaper),
        total: data.total,
      };
    } catch (apiError) {
      console.error("Error searching from API, using fallback data:", apiError);
      // Fallback to static data if API fails
      // Generate some results based on the query
      const fallbackResults = [
        {
          id: `search-${query.replace(/\s+/g, "-").toLowerCase()}-1`,
          imageUrl:
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
          title: `${query} Wallpaper 1`,
          isFavorite: false,
          category: query,
          author: "Unsplash",
        },
        {
          id: `search-${query.replace(/\s+/g, "-").toLowerCase()}-2`,
          imageUrl:
            "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80",
          title: `${query} Wallpaper 2`,
          isFavorite: false,
          category: query,
          author: "Unsplash",
        },
        {
          id: `search-${query.replace(/\s+/g, "-").toLowerCase()}-3`,
          imageUrl:
            "https://images.unsplash.com/photo-1516617442634-75371039cb3a?w=400&q=80",
          title: `${query} Wallpaper 3`,
          isFavorite: false,
          category: query,
          author: "Unsplash",
        },
      ];
      return {
        results: fallbackResults,
        total: fallbackResults.length,
      };
    }
  } catch (error) {
    console.error("Error searching photos:", error);
    return { results: [], total: 0 };
  }
};

// Get photos by category/collection
export const getPhotosByCategory = async (
  category: string,
  page = 1,
  perPage = 20,
): Promise<WallpaperItem[]> => {
  try {
    // For simplicity, we're using search with the category as the query
    // In a real app, you might want to map categories to collection IDs
    const { results } = await searchPhotos(category, page, perPage);

    // Add the category to each wallpaper
    return results.map((wallpaper) => ({
      ...wallpaper,
      category,
    }));
  } catch (error) {
    console.error(`Error fetching photos for category ${category}:`, error);

    // Fallback data for categories
    const categoryFallbacks: Record<string, WallpaperItem[]> = {
      abstract: [
        {
          id: "abstract-1",
          imageUrl:
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
          title: "Abstract Wave",
          isFavorite: false,
          category: "Abstract",
          author: "Unsplash",
        },
        {
          id: "abstract-2",
          imageUrl:
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80",
          title: "Abstract Geometry",
          isFavorite: false,
          category: "Abstract",
          author: "Unsplash",
        },
      ],
      nature: [
        {
          id: "nature-1",
          imageUrl:
            "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80",
          title: "Mountain View",
          isFavorite: false,
          category: "Nature",
          author: "Unsplash",
        },
        {
          id: "nature-2",
          imageUrl:
            "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
          title: "Forest Path",
          isFavorite: false,
          category: "Nature",
          author: "Unsplash",
        },
      ],
      minimal: [
        {
          id: "minimal-1",
          imageUrl:
            "https://images.unsplash.com/photo-1516617442634-75371039cb3a?w=400&q=80",
          title: "Minimal Dark",
          isFavorite: false,
          category: "Minimal",
          author: "Unsplash",
        },
      ],
      space: [
        {
          id: "space-1",
          imageUrl:
            "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80",
          title: "Galaxy",
          isFavorite: false,
          category: "Space",
          author: "Unsplash",
        },
      ],
    };

    // Return fallback data for the category if available, otherwise empty array
    return categoryFallbacks[category.toLowerCase()] || [];
  }
};

// Get a single photo by ID
export const getPhotoById = async (
  id: string,
): Promise<WallpaperItem | null> => {
  try {
    // Check if it's a search result ID (starts with 'search-')
    if (id.startsWith("search-")) {
      const query = id.replace("search-", "").split("-")[0];
      const { results } = await searchPhotos(query, 1, 1);
      if (results.length > 0) {
        return {
          ...results[0],
          id,
          title: query.charAt(0).toUpperCase() + query.slice(1),
        };
      }
      throw new Error("Search result not found");
    }

    // Check if it's a category fallback ID
    const categoryMatch = id.match(/^([a-z]+)-\d+$/);
    if (categoryMatch) {
      const category = categoryMatch[1];
      const fallbacks = await getPhotosByCategory(category);
      const fallback = fallbacks.find((item) => item.id === id);
      if (fallback) return fallback;
    }

    // Try to fetch from API
    try {
      const response = await fetch(`${UNSPLASH_API_URL}/photos/${id}`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const photo: UnsplashPhoto = await response.json();
      return mapUnsplashToWallpaper(photo);
    } catch (apiError) {
      console.error(`API error fetching photo with ID ${id}:`, apiError);

      // Fallback for random photo IDs
      if (id.startsWith("photo-")) {
        const photos = await getRandomPhotos(6);
        const index = parseInt(id.replace("photo-", "")) - 1;
        if (photos.length > 0 && index >= 0 && index < photos.length) {
          return photos[index];
        }
      }

      // Last resort fallback
      return {
        id,
        imageUrl:
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
        title: "Wallpaper",
        isFavorite: false,
        author: "Unsplash",
        category: "Abstract",
      };
    }
  } catch (error) {
    console.error(`Error fetching photo with ID ${id}:`, error);
    return {
      id,
      imageUrl:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
      title: "Wallpaper",
      isFavorite: false,
      author: "Unsplash",
      category: "Abstract",
    };
  }
};
