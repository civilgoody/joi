import { Skeleton } from "./skeleton";

// Reusable fallback components for different UI patterns
export const Fallbacks = {
  // Input field fallback
  Input: (props?: { className?: string }) => (
    <Skeleton className={`h-10 rounded ${props?.className || ""}`} />
  ),

  // Select dropdown fallback
  Select: (props?: { className?: string }) => (
    <Skeleton className={`h-10 rounded ${props?.className || ""}`} />
  ),

  // Button fallback
  Button: (props?: { className?: string }) => (
    <Skeleton className={`h-10 rounded ${props?.className || ""}`} />
  ),

  // Checkbox list fallback
  CheckboxList: ({
    count = 4,
    className,
  }: {
    count?: number;
    className?: string;
  }) => (
    <div className={`space-y-2 ${className || ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center">
          <Skeleton className="w-3 h-3 rounded" />
          <Skeleton className="ml-2 h-3 w-20 rounded" />
        </div>
      ))}
    </div>
  ),

  // Rating stars fallback
  Rating: ({
    count = 5,
    className,
  }: {
    count?: number;
    className?: string;
  }) => (
    <div className={`flex gap-2 ${className || ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="w-8 h-8 rounded" />
      ))}
    </div>
  ),

  // Price range fallback
  PriceRange: (props?: { className?: string }) => (
    <div className={`space-y-4 ${props?.className || ""}`}>
      <Skeleton className="h-4 rounded" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
      </div>
    </div>
  ),

  // Crop grid fallback
  CropGrid: ({
    count = 8,
    className,
  }: {
    count?: number;
    className?: string;
  }) => (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className || ""}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="rounded-lg h-64" />
      ))}
    </div>
  ),

  // Location filters fallback (two selects)
  LocationFilters: (props?: { className?: string }) => (
    <div className={`space-y-3 ${props?.className || ""}`}>
      <Skeleton className="h-10 rounded" />
      <Skeleton className="h-10 rounded" />
    </div>
  ),
  List: ({
    count = 4,
    height = "h-10",
    className,
  }: {
    count?: number;
    className?: string;
    height?: string;
  }) => (
    <div className={`space-y-2 ${className || ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`${height} rounded`} />
      ))}
    </div>
  ),
};
