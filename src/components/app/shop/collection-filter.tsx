"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { id: "smartphones", label: "Smart Phones", count: 24 },
  { id: "laptops", label: "Laptops", count: 18 },
  { id: "headphones", label: "Headphones", count: 12 },
  { id: "tablets", label: "Tablets", count: 9 },
  { id: "smartwatches", label: "Smart Watches", count: 15 },
  { id: "accessories", label: "Accessories", count: 32 },
];

const brands = [
  { id: "apple", label: "Apple", count: 20 },
  { id: "samsung", label: "Samsung", count: 18 },
  { id: "sony", label: "Sony", count: 14 },
  { id: "xiaomi", label: "Xiaomi", count: 22 },
  { id: "lg", label: "LG", count: 8 },
  { id: "bose", label: "Bose", count: 6 },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 cursor-pointer group"
      >
        <span className="text-sm font-semibold uppercase tracking-wider">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CollectionFilter = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [availability, setAvailability] = useState("all");

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleBrand = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceMin("");
    setPriceMax("");
    setAvailability("all");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceMin !== "" ||
    priceMax !== "" ||
    availability !== "all";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground h-8 px-2"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={selectedCategories.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                />
                <Label
                  htmlFor={`cat-${cat.id}`}
                  className="text-sm font-normal cursor-pointer leading-none"
                >
                  {cat.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                ({cat.count})
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="pl-7 h-9 text-sm"
            />
          </div>
          <span className="text-muted-foreground text-sm">—</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="pl-7 h-9 text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { label: "Under $50", min: "0", max: "50" },
            { label: "$50 - $100", min: "50", max: "100" },
            { label: "$100 - $500", min: "100", max: "500" },
            { label: "$500+", min: "500", max: "" },
          ].map((range) => (
            <Button
              key={range.label}
              variant="outline"
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full",
                priceMin === range.min &&
                  priceMax === range.max &&
                  "bg-foreground text-background hover:bg-foreground/90 hover:text-background",
              )}
              onClick={() => {
                setPriceMin(range.min);
                setPriceMax(range.max);
              }}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Brands */}
      <FilterSection title="Brand">
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={() => toggleBrand(brand.id)}
                />
                <Label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm font-normal cursor-pointer leading-none"
                >
                  {brand.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                ({brand.count})
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Availability */}
      <FilterSection title="Availability">
        <RadioGroup value={availability} onValueChange={setAvailability}>
          {[
            { value: "all", label: "All Products" },
            { value: "in-stock", label: "In Stock" },
            { value: "out-of-stock", label: "Out of Stock" },
          ].map((item) => (
            <div key={item.value} className="flex items-center gap-2.5">
              <RadioGroupItem value={item.value} id={`avail-${item.value}`} />
              <Label
                htmlFor={`avail-${item.value}`}
                className="text-sm font-normal cursor-pointer leading-none"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterSection>
    </div>
  );
};
