export type CartItem = {
  productId: string;
  slug: string;
  nameUk: string;
  nameRu: string;
  price: number;
  image: string;
  brand: string | null;
  size: string;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};
