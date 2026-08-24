import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начинаем заполнение базы данных...");

  // Очищаем существующие данные (в правильном порядке из-за связей)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Старые данные удалены");

  // ======================
  // Категории
  // ======================
  const categoriesData = [
    {
      slug: "running",
      nameUk: "Бігові",
      nameRu: "Беговые",
      descriptionUk: "Кросівки для бігу та активного спорту",
      descriptionRu: "Кроссовки для бега и активного спорта",
    },
    {
      slug: "lifestyle",
      nameUk: "Повсякденні",
      nameRu: "Повседневные",
      descriptionUk: "Стильні кросівки на кожен день",
      descriptionRu: "Стильные кроссовки на каждый день",
    },
    {
      slug: "basketball",
      nameUk: "Баскетбольні",
      nameRu: "Баскетбольные",
      descriptionUk: "Кросівки для гри в баскетбол",
      descriptionRu: "Кроссовки для игры в баскетбол",
    },
    {
      slug: "training",
      nameUk: "Тренувальні",
      nameRu: "Тренировочные",
      descriptionUk: "Універсальні кросівки для залу",
      descriptionRu: "Универсальные кроссовки для зала",
    },
    {
      slug: "limited",
      nameUk: "Лімітовані",
      nameRu: "Лимитированные",
      descriptionUk: "Ексклюзивні та колекційні моделі",
      descriptionRu: "Эксклюзивные и коллекционные модели",
    },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories.push(created);
    console.log(`  + Категория: ${created.nameUk}`);
  }

  // ======================
  // Данные для генерации товаров
  // ======================
  const brands = ["Nike", "Adidas", "New Balance", "Puma", "Reebok", "Asics", "Salomon", "Hoka"];
  
  const models = [
    { uk: "Air Max", ru: "Air Max" },
    { uk: "Ultraboost", ru: "Ultraboost" },
    { uk: "Gel-Kayano", ru: "Gel-Kayano" },
    { uk: "Classic Leather", ru: "Classic Leather" },
    { uk: "Suede", ru: "Suede" },
    { uk: "Dunk", ru: "Dunk" },
    { uk: "Jordan", ru: "Jordan" },
    { uk: "Forum", ru: "Forum" },
    { uk: "574", ru: "574" },
    { uk: "RS-X", ru: "RS-X" },
    { uk: "Speedcross", ru: "Speedcross" },
    { uk: "Clifton", ru: "Clifton" },
    { uk: "Pegasus", ru: "Pegasus" },
    { uk: "Samba", ru: "Samba" },
    { uk: "Gazelle", ru: "Gazelle" },
  ];

  const colors = [
    { uk: "Чорний", ru: "Чёрный" },
    { uk: "Білий", ru: "Белый" },
    { uk: "Сірий", ru: "Серый" },
    { uk: "Синій", ru: "Синий" },
    { uk: "Червоний", ru: "Красный" },
    { uk: "Зелений", ru: "Зелёный" },
    { uk: "Бежевий", ru: "Бежевый" },
    { uk: "Оранжевий", ru: "Оранжевый" },
  ];

  const sizeOptions = ["39", "40", "41", "42", "43", "44", "45"];

  // ======================
  // Генерация ~70 товаров
  // ======================
  const products = [];
  let productIndex = 1;

  for (let i = 0; i < 70; i++) {
   const brand = brands[i % brands.length]!;
   const model = models[i % models.length]!;
   const color = colors[i % colors.length]!;
   const category = categories[i % categories.length]!;

    const basePrice = 2500 + (i % 20) * 350 + Math.floor(Math.random() * 500);
    const hasDiscount = i % 5 === 0;
    const price = hasDiscount ? Math.round(basePrice * 0.85) : basePrice;
    const oldPrice = hasDiscount ? basePrice : null;

    const year = 2023 + (i % 4);
    const nameUk = `${brand} ${model.uk} ${color.uk}`;
    const nameRu = `${brand} ${model.ru} ${color.ru}`;

    const slug = `${brand.toLowerCase()}-${model.uk.toLowerCase().replace(/\s+/g, "-")}-${color.uk.toLowerCase()}-${productIndex}`
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    // Случайные размеры в наличии
    const availableSizes = sizeOptions
      .filter(() => Math.random() > 0.3)
      .slice(0, 4 + Math.floor(Math.random() * 3));

    if (availableSizes.length === 0) {
      availableSizes.push("42", "43");
    }

    const product = await prisma.product.create({
      data: {
        slug: `${slug}-${productIndex}`,
        nameUk,
        nameRu,
        descriptionUk: `Якісні кросівки ${brand} ${model.uk} у кольорі ${color.uk}. Ідеально підходять для повсякденного носіння та активного відпочинку. Рік моделі: ${year}.`,
        descriptionRu: `Качественные кроссовки ${brand} ${model.ru} в цвете ${color.ru}. Идеально подходят для повседневной носки и активного отдыха. Год модели: ${year}.`,
        price: new Prisma.Decimal(price),
        oldPrice: oldPrice ? new Prisma.Decimal(oldPrice) : null,
        brand,
        colorUk: color.uk,
        colorRu: color.ru,
        sizes: availableSizes,
        images: [
          `/images/sneakers/placeholder-${(i % 8) + 1}.jpg`,
          `/images/sneakers/placeholder-${(i % 8) + 1}-2.jpg`,
        ],
        stock: Math.floor(Math.random() * 25) + 3,
        isActive: true,
        isFeatured: i < 8, // первые 8 — рекомендуемые
        categoryId: category.id,
      },
    });

    products.push(product);
    productIndex++;

    if ((i + 1) % 10 === 0) {
      console.log(`  + Создано товаров: ${i + 1}/70`);
    }
  }

  // ======================
  // Тестовый админ
  // ======================
  await prisma.user.create({
    data: {
      email: "admin@sneakerstore.ua",
      name: "Адміністратор",
      role: "ADMIN",
    },
  });

  console.log("\n✅ База успешно заполнена!");
  console.log(`   Категорий: ${categories.length}`);
  console.log(`   Товаров: ${products.length}`);
  console.log(`   Админ: admin@sneakerstore.ua`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при заполнении:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
