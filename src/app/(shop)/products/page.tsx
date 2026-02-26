import Image from "next/image";
import Link from "next/link";
import { collections } from "@/lib/data";
const ProductsPage = () => {
  return (
    <section className="w-full py-15 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <h2 className="text-4xl md:text-5xl font-semibold text-balance">
            Collections List
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore our thoughtfully curated collections: Sweaters, Handbags,
            Denim, and more—each perfect for enhancing every style on every
            special occasion and daily wear.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols- 2xl:grid-cols-5 gap-4">
          {collections.map((collection, index) => (
            <Link
              key={index}
              href={`/collections/${collection.slug}`}
              className="group relative overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <Image
                src={collection.imageUrl}
                alt={collection.name}
                width={500}
                height={500}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-white/90">Explore collection →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
