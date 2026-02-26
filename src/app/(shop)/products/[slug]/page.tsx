"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { mockProducts } from "@/lib/data";
import {
  Home,
  Maximize2,
  Minus,
  Plus,
  Heart,
  Layers,
  Eye,
  HelpCircle,
  Share2,
  Truck,
  Tag,
  Package,
  Flame,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn, getHexFromColorName, stringToColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TextUnderline } from "@/components/ui/text-underline";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ProductOption,
  ProductVariant,
} from "@/components/app/shop/product-card";

const ProductDetail = () => {
  const pathName = usePathname();
  const slug = pathName.split("/").filter(Boolean).pop() ?? "";
  const product = mockProducts.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (product) {
      const defaults: Record<string, string> = {};
      product.options.forEach((opt) => {
        if (opt.values.length > 0) {
          defaults[opt.name] = opt.values[0];
        }
      });
      setSelectedOptions(defaults);
    }
  }, [product]);

  const selectedVariant = product?.variants.find((v: ProductVariant) =>
    Object.keys(selectedOptions).every(
      (key) => v.attributes[key] === selectedOptions[key],
    ),
  );

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant?.id]);

  if (!product) {
    return (
      <div className="w-full py-20 text-center text-muted-foreground">
        Product not found.
      </div>
    );
  }

  const displayImages = selectedVariant?.images || product.images;
  const variantPrice = selectedVariant?.price || product.basePrice;
  const stock = selectedVariant?.stock || 0;
  const inStock = stock > 0;

  const discountedPrice =
    product.discountType === "percentage"
      ? variantPrice - (variantPrice * (product.discount ?? 0)) / 100
      : product.discountType === "fixed"
        ? variantPrice - (product.discount ?? 0)
        : variantPrice;

  const originalPrice = variantPrice;

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, Math.min(newQuantity, stock)));
  };

  const stockPercentage = Math.min((stock / 100) * 100, 100); // Arbitrary max of 100 for the bar

  return (
    <div className="w-full py-10 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="flex justify-start mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main layout */}
        <div className="flex flex-col xl:flex-row gap-10">
          {/* LEFT: Image Gallery */}
          <div className="flex flex-row xl:flex-row gap-3 xl:w-[55%]">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 cursor-pointer",
                    selectedImage === i
                      ? "border-foreground shadow-md"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main image carousel */}
            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-muted group">
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${selectedImage * 100}%)` }}
              >
                {displayImages.map((img, i) => (
                  <div key={i} className="relative min-w-full h-full shrink-0">
                    <Image
                      src={img}
                      alt={`${product.name} image ${i + 1}`}
                      fill
                      className="object-cover cursor-zoom-in"
                    />
                  </div>
                ))}
              </div>

              <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Button
                  className="cursor-pointer rounded-full size-12"
                  variant={"secondary"}
                  onClick={() => {
                    if (selectedImage > 0) {
                      setSelectedImage(selectedImage - 1);
                    } else {
                      setSelectedImage(displayImages.length - 1);
                    }
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  className="cursor-pointer rounded-full size-12"
                  variant={"secondary"}
                  onClick={() => {
                    if (selectedImage < displayImages.length - 1) {
                      setSelectedImage(selectedImage + 1);
                    } else {
                      setSelectedImage(0);
                    }
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              {/* Expand button */}
              <Button
                className="absolute top-3 right-3 cursor-pointer"
                variant={"ghost"}
                size={"icon-lg"}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col gap-4 xl:flex-1">
            <div className="flex items-center justify-start gap-3 font-medium">
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

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold leading-snug text-foreground">
              {product.name}
            </h1>

            {/* Rating & sold */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.reviewCount} reviews
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-orange-500">
                <Flame className="h-4 w-4" />8 sold in last 12 hours
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-destructive/80">
                ${discountedPrice.toFixed(2)}
              </span>
              {discountedPrice !== originalPrice && (
                <span className="text-lg font-medium text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Info cards */}
            <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4">
                <Truck className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-foreground">
                  Estimate delivery times:{" "}
                  <strong>3-5 days International.</strong>
                </p>
              </div>
              <div className="flex items-center gap-3 px-6 py-4">
                <Tag className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-foreground">
                  Use code <strong>&quot;WELCOME15&quot;</strong> for discount
                  15% on your first order.
                </p>
              </div>
              <div className="flex items-center gap-3 px-6 py-4">
                <Package className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-foreground">
                  Free shipping &amp; returns:{" "}
                  <strong>On all orders over $150.</strong>
                </p>
              </div>
            </div>

            {/* Viewers + actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground bg-muted px-3 py-2 rounded-lg">
                <Eye className="h-4 w-4" />
                <span>39 peoples are viewing this right now</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {product.options.map((option) => (
                <div key={option.name}>
                  <div className="">
                    <span className="text-muted-foreground font-medium">
                      {option.name}:
                    </span>{" "}
                    <span className="font-bold">
                      {selectedOptions[option.name] || ""}
                    </span>
                  </div>
                  <RadioOption
                    value={selectedOptions[option.name] || ""}
                    setValue={(val) =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [option.name]: val,
                      }))
                    }
                    option={option}
                  />
                </div>
              ))}
            </div>

            {/* Ask a question / Share */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                <HelpCircle className="h-4 w-4" />
                Ask a question
              </button>
              <button className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            <div className="h-px bg-border" />

            {/* Stock urgency */}
            <div>
              {inStock ? (
                <>
                  <p className="text-sm mb-2">
                    Hurry up! Only{" "}
                    <span className="text-destructive font-semibold">
                      {stock} item(s)
                    </span>{" "}
                    left in stock
                  </p>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-destructive rounded-full"
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-destructive font-semibold">
                  Out of stock
                </p>
              )}
            </div>

            {/* Quantity + Add to Cart + Wishlist + Compare */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Quantity */}
              <div className="flex items-center gap-0 border border-border rounded-full overflow-hidden h-11">
                <Button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="size-11 bg-background"
                  variant={"secondary"}
                  disabled={quantity <= 1 || !inStock}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <Input
                  className="border-none focus-visible:ring-0 w-12 text-center"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  disabled={!inStock}
                />
                <Button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="size-11 bg-background"
                  variant={"secondary"}
                  disabled={quantity >= stock || !inStock}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {/* Add to Cart */}
              <Button
                className="flex-1 h-11 bg-foreground text-background rounded-full font-semibold text-sm hover:bg-foreground/85 transition-colors"
                disabled={!selectedVariant || !inStock}
              >
                Add to Cart
              </Button>

              {/* Wishlist */}
              <Button
                className="w-11 h-11 shrink-0 rounded-full"
                variant={"secondary"}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox id="terms" />
              <div className="flex items-center gap-1">
                <Label htmlFor="terms" className="font-normal cursor-pointer">
                  I agree with
                </Label>
                <TextUnderline className="font-medium" size="sm">
                  Terms &amp; Conditions
                </TextUnderline>
              </div>
            </div>

            {/* Buy it now */}
            <Button
              className="w-full h-12 rounded-full text-white font-semibold text-base transition-colors"
              disabled={!selectedVariant || !inStock}
            >
              Buy it now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

const RadioOption = ({
  value,
  setValue,
  option,
}: {
  value: string;
  setValue: (val: string) => void;
  option: ProductOption;
}) => {
  return (
    <RadioGroup
      defaultValue={value}
      onValueChange={setValue}
      className="flex items-center gap-x-2"
    >
      {option.values.map((val) => (
        <div key={val}>
          <RadioGroupItem value={val} id={val} className="peer sr-only " />
          {option.name === "Color" ? (
            <Label
              htmlFor={val}
              className="flex w-9 h-9 items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-teal-400 [&:has([data-state=checked])]:border-teal-400 cursor-pointer"
              style={{ backgroundColor: getHexFromColorName(val) }}
            ></Label>
          ) : (
            <Label
              htmlFor={val}
              className="flex w-fit h-9 items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-teal-400 [&:has([data-state=checked])]:border-teal-400 cursor-pointer"
            >
              {val}
            </Label>
          )}
        </div>
      ))}
    </RadioGroup>
  );
};
