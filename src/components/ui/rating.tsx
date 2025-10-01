"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { MdStar } from "react-icons/md";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  className?: string;
  iconSize?: number;
  maxStars?: number;
  readOnly?: boolean;
  color?: string;
}

const StarIcon = React.memo(
  ({
    iconSize,
    index,
    isInteractive,
    onClick,
    onMouseEnter,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
    iconSize: number;
    onClick: () => void;
    onMouseEnter: () => void;
    isInteractive: boolean;
  }) => (
    <MdStar
      key={index}
      size={iconSize}
      fill={style.fill}
      color={style.color}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "transition-colors duration-200",
        isInteractive && "cursor-pointer hover:scale-110"
      )}
      style={style}
    />
  )
);
StarIcon.displayName = "StarIcon";

const StarRating = ({
  className,
  color = "#E9B306",
  iconSize = 16,
  maxStars = 5,
  onChange,
  readOnly = false,
  value,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const handleStarClick = React.useCallback(
    (index: number) => {
      if (readOnly || !onChange) return;
      const newRating = index + 1;
      onChange(newRating);
    },
    [readOnly, onChange]
  );

  const handleStarHover = React.useCallback(
    (index: number) => {
      if (!readOnly) {
        setHoverRating(index + 1);
      }
    },
    [readOnly]
  );

  const handleMouseLeave = React.useCallback(() => {
    if (!readOnly) {
      setHoverRating(null);
    }
  }, [readOnly]);

  const getStarStyle = React.useCallback(
    (index: number) => {
      const ratingToUse =
        !readOnly && hoverRating !== null ? hoverRating : value;
      return {
        color: ratingToUse > index ? color : "gray",
        fill: ratingToUse > index ? color : "#D4D4D4",
      } as React.CSSProperties;
    },
    [readOnly, hoverRating, value, color]
  );

  const stars = React.useMemo(() => {
    return Array.from({ length: maxStars }).map((_, index) => {
      const style = getStarStyle(index);
      return (
        <StarIcon
          key={index}
          index={index}
          style={style}
          iconSize={iconSize}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          isInteractive={!readOnly}
        />
      );
    });
  }, [
    maxStars,
    getStarStyle,
    iconSize,
    handleStarClick,
    handleStarHover,
    readOnly,
  ]);

  return (
    <div
      className={cn("flex items-center gap-x-0", className)}
      onMouseLeave={handleMouseLeave}
    >
      {stars}
    </div>
  );
};

interface RatingGroupProps {
  options: number[];
  name: string;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const RatingGroup = ({
  options,
  name,
  value,
  onChange,
  className,
}: RatingGroupProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {options.map((rating) => (
        <label key={rating} className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={name}
            value={rating}
            checked={value === rating}
            onChange={() => onChange?.(rating)}
            className="w-4 h-4 text-primary border-muted-dark focus:ring-primary"
          />
          <div className="ml-2 flex items-center">
            <StarRating value={rating} iconSize={24} readOnly />
            <span className="ml-1 text-lg text-muted-light font-bold">
              & up
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};

export { StarRating, RatingGroup };
