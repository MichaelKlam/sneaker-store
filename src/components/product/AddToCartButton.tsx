"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";

type Props = {
  product: {
    id: string;
    slug: string;
    nameUk: string;
    nameRu: string;
    price: number;
    images: string[];
    brand: string | null;
    sizes: string[];
    stock: number;
  };
};

export default function AddToCartButton({ product }: Props) {
  const t = useTranslations("Product");
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0] || ""
  );
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!selectedSize || product.stock === 0) return;

    setIsAdding(true);

    addItem({
      productId: product.id,
      slug: product.slug,
      nameUk: product.nameUk,
      nameRu: product.nameRu,
      price: product.price,
      image: product.images[0] || "",
      brand: product.brand,
      size: selectedSize,
    });

    // Небольшая анимация
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="space-y-4">
      {/* Выбор размера */}
      {product.sizes.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-3">{t("size")}</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-14 h-11 border rounded-lg text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Кнопки */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleAdd}
          disabled={product.stock === 0 || !selectedSize || isAdding}
          className="flex-1 bg-black text-white py-4 px-8 rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isAdding ? "✓" : t("addToCart")}
        </button>
      </div>
    </div>
  );
}
