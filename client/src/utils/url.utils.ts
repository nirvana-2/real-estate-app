const BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

/**
 * Constructs a full URL for an image path returned by the backend.
 * If the path is already a full URL, it returns it as is.
 * If no path is provided, it returns a professional placeholder.
 */
export const getImageUrl = (path: string | undefined): string => {
    if (!path) {
        // Professional placeholder for properties without images
        return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000";
    }

    if (path.startsWith("http")) {
        return path;
    }

    // Ensure path doesn't start with leading slash if BASE_URL ends with one, or vice versa
    const cleanBase = BASE_URL.replace(/\/$/, "");
    const cleanPath = path.replace(/^\//, "");

    return `${cleanBase}/${cleanPath}`;
};
