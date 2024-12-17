import { Product, Status, SubSubCategory } from '../types/types'

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Gaming Laptop X1",
    description: "Powerful gaming laptop with high-end graphics",
    price: 1299.99,
    stock: 50,
    brand: "TechPro",
    weight: 2.5,
    length: 36,
    width: 25,
    height: 2,
    status: Status.active,
    seoTitle: "Gaming Laptop X1 - High Performance Gaming",
    seoDescription: "Experience unparalleled gaming with the Gaming Laptop X1",
    metaKeywords: "gaming laptop, high performance, TechPro",
    subSubCategoryId: 211,
    subSubCategory: { id: 211, name: "GAMING LAPTOP", subCategoryId: 21 } as SubSubCategory,
    images: [{ id: 1, url: "/placeholder.svg?height=100&width=100", productId: 1 }],
  },
  {
    id: 2,
    name: "Pro Gaming Mouse",
    description: "High-precision gaming mouse for professional gamers",
    price: 79.99,
    stock: 100,
    brand: "GameGear",
    weight: 0.1,
    length: 12,
    width: 7,
    height: 4,
    status: Status.active,
    seoTitle: "Pro Gaming Mouse - Precision Control for Gamers",
    seoDescription: "Enhance your gaming performance with the Pro Gaming Mouse",
    metaKeywords: "gaming mouse, precision, GameGear",
    subSubCategoryId: 235,
    subSubCategory: { id: 235, name: "GAMING MOUSE", subCategoryId: 23 } as SubSubCategory,
    images: [{ id: 2, url: "/placeholder.svg?height=100&width=100", productId: 2 }],
  },
  {
    id: 3,
    name: "4K Gaming Monitor",
    description: "Ultra-high definition gaming monitor for immersive gameplay",
    price: 499.99,
    stock: 30,
    brand: "VisualPro",
    weight: 5,
    length: 60,
    width: 35,
    height: 5,
    status: Status.active,
    seoTitle: "4K Gaming Monitor - Immersive Gaming Experience",
    seoDescription: "Elevate your gaming with our 4K Ultra HD Gaming Monitor",
    metaKeywords: "4K monitor, gaming, VisualPro",
    subSubCategoryId: 238,
    subSubCategory: { id: 238, name: "GAMING MONITORS", subCategoryId: 23 } as SubSubCategory,
    images: [{ id: 3, url: "/placeholder.svg?height=100&width=100", productId: 3 }],
  },
]

export const searchProducts = (query: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
      resolve(results)
    }, 300)
  })
}

