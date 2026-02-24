"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Columns4,
  Grid2X2,
  Grid3x2,
  Grip,
  Home,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CollectionFilter, ProductCard } from "@/components/app/shop";
import { cn } from "@/lib/utils";
import { mockProducts, collections } from "@/lib/data";

const CollectionPage = () => {
  const pathName = usePathname();
  const [sortBy, setSortBy] = useState<string>("featured");
  const [type, setType] = useState<"grid" | "list">("grid");

  const [gridCols, setGridCols] = useState<number>(3);

  const slug = pathName.split("/").filter(Boolean).pop() ?? "";
  const collection = collections.find((c) => c.slug === slug);
  const collectionName = collection?.name ?? slug.replace(/-/g, " ");

  return (
    <section className="w-full py-15 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb className="flex justify-center">
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
                <BreadcrumbLink asChild>
                  <Link href="/collections">Collections</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {collectionName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-3xl md:text-4xl font-semibold text-balance capitalize">
            {collectionName}
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Filter - Desktop */}
          <div className="col-span-1 hidden xl:block">
            <div className="sticky top-20">
              <CollectionFilter />
            </div>
          </div>

          {/* Products */}
          <div className="col-span-1 xl:col-span-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="xl:hidden gap-2"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] overflow-y-auto p-6"
                  >
                    <SheetTitle />
                    <CollectionFilter />
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-3">
                {/* Grid toggle - desktop */}
                <div className="hidden xl:flex items-center border rounded-lg overflow-hidden">
                  {type === "grid" ? (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setGridCols(2)}
                            className={cn(
                              "bg-background hover:bg-muted text-foreground rounded-r-none",
                              gridCols === 2 &&
                                "bg-foreground text-background hover:bg-foreground/80",
                            )}
                          >
                            <Grid2X2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={5}
                          className="text-xs px-2 py-1"
                        >
                          <p>2 Columns</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setGridCols(3)}
                            className={cn(
                              "bg-background hover:bg-muted text-foreground rounded-none",
                              gridCols === 3 &&
                                "bg-foreground text-background hover:bg-foreground/80",
                            )}
                          >
                            <Grid3x2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={5}
                          className="text-xs px-2 py-1"
                        >
                          <p>3 Columns</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setGridCols(4)}
                            className={cn(
                              "bg-background hover:bg-muted text-foreground rounded-none",
                              gridCols === 4 &&
                                "bg-foreground text-background hover:bg-foreground/80",
                            )}
                          >
                            <Columns4 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={5}
                          className="text-xs px-2 py-1"
                        >
                          <p>4 Columns</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            setType("grid");
                            setGridCols(3);
                          }}
                          className={cn(
                            "bg-background hover:bg-muted text-foreground rounded-r-none",
                          )}
                        >
                          <Grip className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        sideOffset={5}
                        className="text-xs px-2 py-1"
                      >
                        <p>Grid</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          setType("list");
                          setGridCols(0);
                        }}
                        className={cn(
                          "bg-background hover:bg-muted text-foreground rounded-l-none",
                          type === "list" &&
                            "bg-foreground text-background hover:bg-foreground/80",
                        )}
                      >
                        <List className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={5}
                      className="text-xs px-2 py-1"
                    >
                      <p>List</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-9 text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {type === "grid" ? (
              <div
                className={cn(
                  "grid gap-4 md:gap-6",
                  gridCols === 4 && "grid-cols-3 xl:grid-cols-4",
                  gridCols === 3 && "grid-cols-2 xl:grid-cols-3",
                  gridCols === 2 && "grid-cols-1 xl:grid-cols-2",
                )}
              >
                {mockProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cols={gridCols}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionPage;
