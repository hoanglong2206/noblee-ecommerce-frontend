"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn, stringToColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export interface ProductOption {
  name: string; // "Color", "Size"
  values: string[]; // ["Red", "Black"] or ["M", "L"]
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // { Color: "Red", Size: "M" }
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  images: string[];
  basePrice: number;
  discountType?: "percentage" | "fixed";
  discount?: number;
  rating: number;
  reviewCount: number;
  badge?: string;

  options: ProductOption[];
  variants: ProductVariant[];

  totalStock: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  cols?: number;
  index?: number;
}

export const ProductCard = ({
  product,
  cols = 4,
  index = 0,
}: ProductCardProps) => {
  const discountPercentage =
    product.discountType === "percentage" ? (product.discount ?? 0) : 0;
  const newPrice =
    product.discountType === "percentage"
      ? product.basePrice -
        (product.basePrice * (discountPercentage || 0)) / 100
      : product.basePrice - (product.discount || 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className="group relative flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-102 group-hover:opacity-0"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover absolute inset-0 transition-all duration-500 opacity-0 group-hover:scale-102 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Sale badge */}
        <div
          className={cn(
            "absolute z-10 flex flex-col select-none cursor-pointer font-medium",
            cols === 2 && "text-lg gap-2 top-4 left-4",
            cols === 3 && "text-sm gap-1.5 top-3 left-3",
            cols === 4 && "text-xs gap-1 top-2 left-2",
          )}
        >
          {product.discount &&
            (product.discountType === "percentage" ? (
              <div className="bg-destructive/70 px-4 py-1 rounded-full text-background/90 w-fit text-center">
                -{product.discount}%
              </div>
            ) : (
              <div className="bg-destructive/70 px-3 py-1 rounded-full text-background/90 w-fit text-center">
                Save ${product.discount}
              </div>
            ))}
          {product.badge && (
            <div
              className="text-primary-foreground px-3 py-1 rounded-full w-fit"
              style={{ backgroundColor: stringToColor(product.badge) }}
            >
              {product.badge}
            </div>
          )}
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center opacity-0 group-hover:opacity-100"></div>

        {/* Quick actions */}
        <div
          className={cn(
            "absolute  right-0 left-0 flex items-center justify-center translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300",
            cols === 2 && "bottom-6",
            cols === 3 && "bottom-3",
            cols === 4 && "bottom-0",
          )}
        >
          <button
            className={cn(
              "flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium shadow-md hover:bg-foreground/80 transition-colors cursor-pointer w-1/2",
              !product.inStock && "opacity-50 cursor-not-allowed",
            )}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>

        <div className="absolute bottom-0 right-3 top-3 flex flex-col items-center gap-2.5 opacity-0 translate-x-full group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                className="rounded-full size-12 bg-background shadow-md hover:bg-foreground transition-colors hover:text-background"
              >
                <Heart className="h-7 w-7" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={5}>
              <p>Add to wishlist</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                className="rounded-full size-12 bg-background shadow-md hover:bg-foreground transition-colors hover:text-background"
              >
                <Eye className="h-7 w-7" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={5}>
              <p>Quick view</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 pt-3">
        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          className={cn(
            "font-medium line-clamp-2 hover:text-destructive/80 transition-colors leading-snug",
            cols === 2 && "text-xl",
            cols === 3 && "text-lg",
            cols === 4 && "text-base",
          )}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                cols === 2 && "h-5 w-5",
                cols === 3 && "h-4.5 w-4.5",
                cols === 4 && "h-4 w-4",
                i < Math.floor(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted",
              )}
            />
          ))}
          <span
            className={cn(
              "text-muted-foreground ml-1",
              cols === 2 && "text-lg",
              cols === 3 && "text-base",
              cols === 4 && "text-sm",
            )}
          >
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div
          className={cn(
            "flex items-center gap-2",
            cols === 2 && "text-xl",
            cols === 3 && "text-lg",
            cols === 4 && "text-base",
          )}
        >
          <span className="font-semibold text-destructive/80">
            ${product.basePrice.toFixed(2)}
          </span>
          {newPrice !== product.basePrice && (
            <span className="text-muted-foreground line-through">
              ${newPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
