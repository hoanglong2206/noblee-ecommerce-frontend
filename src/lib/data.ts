import type { CustomerRow } from "@/components/app/admin";
import type { Product } from "@/components/app/shop";

export interface Collection {
  name: string;
  imageUrl: string;
  slug: string;
}

export const collections: Collection[] = [
  {
    name: "Smart Phones",
    imageUrl:
      "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_8_1-min.jpg?v=1741245731&width=720",
    slug: "smart-phones",
  },
  {
    name: "Smart Watches",
    imageUrl:
      "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_4_2-min.jpg?v=1741245450&width=1100",
    slug: "smart-watches",
  },
  {
    name: "Headphones",
    imageUrl:
      "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_6_1-min.jpg?v=1741245547&width=720",
    slug: "headphones",
  },
  {
    name: "Tablets/iPad",
    imageUrl:
      "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_5_1-min.jpg?v=1741245493&width=720",
    slug: "tablets-ipad",
  },
  {
    name: "Computers & Laptops",
    imageUrl:
      "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_7_1-min.jpg?v=1741245590&width=720",
    slug: "computers-laptops",
  },
];

export const customersData: CustomerRow[] = [
  {
    id: "cus_1",
    fullName: "Emily Johnson",
    email: "emily.johnson@example.com",
    phoneNumber: "+1 555-123-4567",
    gender: "female",
    dateOfBirth: "1990-04-12",
    avatarUrl: null,
    bio: "Loyal customer since 2023",
    createdAt: "2023-01-05T09:15:00Z",
    updatedAt: "2025-12-22T14:10:00Z",
    isDisable: false,
    totalOrders: 36,
    totalSpend: "$4,580",
    location: "San Francisco, USA",
    lastActive: "2 hours ago",
  },
  {
    id: "cus_2",
    fullName: "Michael Chen",
    email: "michael.chen@example.com",
    phoneNumber: "+1 555-876-2345",
    gender: "male",
    dateOfBirth: "1987-08-21",
    avatarUrl: null,
    bio: null,
    createdAt: "2022-11-18T11:30:00Z",
    updatedAt: "2026-01-20T09:05:00Z",
    isDisable: false,
    totalOrders: 58,
    totalSpend: "$7,910",
    location: "New York, USA",
    lastActive: "5 minutes ago",
  },
  {
    id: "cus_3",
    fullName: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    phoneNumber: "+971 55 123 4567",
    gender: "female",
    dateOfBirth: "1995-02-10",
    avatarUrl: null,
    bio: "Enjoys seasonal collections",
    createdAt: "2024-02-02T08:40:00Z",
    updatedAt: "2025-12-15T16:45:00Z",
    isDisable: true,
    totalOrders: 9,
    totalSpend: "$1,240",
    location: "Dubai, UAE",
    lastActive: "3 months ago",
  },
  {
    id: "cus_4",
    fullName: "Lucas Martin",
    email: "lucas.martin@example.com",
    phoneNumber: "+33 1 23 45 67 89",
    gender: "male",
    dateOfBirth: "1992-11-03",
    avatarUrl: null,
    bio: null,
    createdAt: "2021-05-28T10:05:00Z",
    updatedAt: "2026-01-10T18:20:00Z",
    isDisable: false,
    totalOrders: 82,
    totalSpend: "$9,320",
    location: "Paris, France",
    lastActive: "1 day ago",
  },
  {
    id: "cus_5",
    fullName: "Ava Thompson",
    email: "ava.thompson@example.com",
    phoneNumber: "+61 2 5550 1234",
    gender: "female",
    dateOfBirth: "1998-07-16",
    avatarUrl: null,
    bio: "Prefers express shipping",
    createdAt: "2023-07-09T07:20:00Z",
    updatedAt: "2025-11-02T12:30:00Z",
    isDisable: false,
    totalOrders: 27,
    totalSpend: "$3,480",
    location: "Sydney, Australia",
    lastActive: "12 hours ago",
  },
  {
    id: "cus_6",
    fullName: "Diego Fernández",
    email: "diego.fernandez@example.com",
    phoneNumber: "+34 91 123 45 67",
    gender: "male",
    dateOfBirth: "1985-01-29",
    avatarUrl: null,
    bio: null,
    createdAt: "2020-09-14T13:55:00Z",
    updatedAt: "2026-01-25T10:40:00Z",
    isDisable: true,
    totalOrders: 14,
    totalSpend: "$2,150",
    location: "Madrid, Spain",
    lastActive: "6 months ago",
  },
];

export const mockProducts: Product[] = [
  {
    id: "p-1",
    name: "Apple iPhone 15 Pro Max Natural Titanium",
    description:
      "iPhone 15 Pro Max. Forged in titanium and featuring the revolutionary A17 Pro chip, it’s the most powerful iPhone we’ve ever created.",
    slug: "iphone-15-pro-max",
    images: [
      "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_1-min.jpg?v=1741244760&width=720",
      "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_2-min.jpg?v=1741244760&width=720",
      "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_3-min.jpg?v=1741244760&width=720",
    ],
    basePrice: 1099.0,
    discountType: "fixed",
    discount: 200.0,
    rating: 5,
    reviewCount: 234,
    options: [
      {
        name: "Color",
        values: ["Pink", "Blue"],
      },
      {
        name: "Size",
        values: ["256GB", "512GB", "1TB"],
      },
    ],
    variants: [
      {
        id: "v-1",
        sku: "p-1-pink-256gb",
        price: 1099.0,
        stock: 50,
        attributes: { Color: "Pink", Size: "256GB" },
        images: [
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_1-min.jpg?v=1741244760&width=720",
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_2-min.jpg?v=1741244760&width=720",
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_3-min.jpg?v=1741244760&width=720",
        ],
      },
      {
        id: "v-2",
        sku: "p-1-pink-512gb",
        price: 1199.0,
        stock: 30,
        attributes: { Color: "Pink", Size: "512GB" },
        images: [
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_1-min.jpg?v=1741244760&width=720",
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_2-min.jpg?v=1741244760&width=720",
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_3-min.jpg?v=1741244760&width=720",
        ],
      },
      {
        id: "v-3",
        sku: "p-1-pink-1tb",
        price: 1299.0,
        stock: 20,
        attributes: { Color: "Pink", Size: "1TB" },
        images: [
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_1-min.jpg?v=1741244760&width=720",
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_2-min.jpg?v=1741244760&width=720",
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_1_3-min.jpg?v=1741244760&width=720",
        ],
      },
      {
        id: "v-4",
        sku: "p-1-blue-256gb",
        price: 1099.0,
        stock: 40,
        attributes: { Color: "Blue", Size: "256GB" },
        images: [
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_8_1-min.jpg?v=1741245731&width=720",
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_8_2-min.jpg?v=1741245731&width=720",
        ],
      },
      {
        id: "v-5",
        sku: "p-1-blue-512gb",
        price: 1199.0,
        stock: 25,
        attributes: { Color: "Blue", Size: "512GB" },
        images: [
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_8_1-min.jpg?v=1741245731&width=720",
          "https://glozin-demo-v2.myshopify.com/cdn/shop/files/products_digital_8_2-min.jpg?v=1741245731&width=720",
        ],
      },
    ],
    totalStock: 180,
    badge: "Best Seller",
    inStock: true,
  },
];
