import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const products = [
  {
    name: 'MacBook Pro 14" M3 Pro',
    description: 'Apple MacBook Pro with M3 Pro chip, 18GB RAM, 512GB SSD. Stunning Liquid Retina XDR display with ProMotion. Up to 18 hours battery life.',
    price: 1999, originalPrice: 2199, category: 'Laptops', brand: 'Apple', stock: 25,
    isFeatured: true, isNewArrival: true, rating: 4.9, numReviews: 128,
    images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' }],
    specifications: new Map([['Chip','M3 Pro'],['RAM','18GB'],['Storage','512GB SSD'],['Display','14.2" Liquid Retina XDR'],['Battery','Up to 18 hours']]),
  },
  {
    name: 'Dell XPS 15 OLED',
    description: 'Dell XPS 15 with Intel Core i9, 32GB RAM, 1TB SSD and a breathtaking 3.5K OLED touch display.',
    price: 1799, originalPrice: 1999, category: 'Laptops', brand: 'Dell', stock: 18,
    isFeatured: true, isNewArrival: false, rating: 4.7, numReviews: 95,
    images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' }],
    specifications: new Map([['CPU','Intel Core i9-13900H'],['RAM','32GB DDR5'],['Storage','1TB NVMe SSD'],['Display','15.6" 3.5K OLED Touch']]),
  },
  {
    name: 'ASUS ROG Strix G16',
    description: 'Dominate every game with ROG Strix G16: AMD Ryzen 9, RTX 4070, 165Hz display, and ROG Aura RGB.',
    price: 1499, originalPrice: 1699, category: 'Laptops', brand: 'ASUS', stock: 12,
    isFeatured: true, isNewArrival: false, rating: 4.8, numReviews: 74,
    images: [{ url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80' }],
    specifications: new Map([['CPU','AMD Ryzen 9 7945HX'],['GPU','RTX 4070 8GB'],['RAM','16GB DDR5'],['Display','16" 165Hz QHD']]),
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'iPhone 15 Pro Max with titanium design, A17 Pro chip, 48MP camera system, and Action Button.',
    price: 1199, originalPrice: 1299, category: 'Smartphones', brand: 'Apple', stock: 40,
    isFeatured: true, isNewArrival: true, rating: 4.9, numReviews: 312,
    images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80' }],
    specifications: new Map([['Chip','A17 Pro'],['Display','6.7" Super Retina XDR'],['Camera','48MP Main + 12MP Ultra Wide'],['Storage','256GB'],['Battery','4422 mAh']]),
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy S24 Ultra with built-in S Pen, 200MP camera, Snapdragon 8 Gen 3 and 6.8" Dynamic AMOLED 2X.',
    price: 1299, originalPrice: 1399, category: 'Smartphones', brand: 'Samsung', stock: 35,
    isFeatured: true, isNewArrival: true, rating: 4.8, numReviews: 245,
    images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80' }],
    specifications: new Map([['Chip','Snapdragon 8 Gen 3'],['Display','6.8" AMOLED 120Hz'],['Camera','200MP + 12MP + 10MP + 10MP'],['Battery','5000 mAh']]),
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Google Pixel 8 Pro with Google Tensor G3, 50MP camera with AI features, and 7 years of OS updates.',
    price: 999, originalPrice: 1099, category: 'Smartphones', brand: 'Google', stock: 28,
    isFeatured: false, isNewArrival: true, rating: 4.6, numReviews: 156,
    images: [{ url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80' }],
    specifications: new Map([['Chip','Google Tensor G3'],['Display','6.7" LTPO OLED'],['Camera','50MP + 48MP + 48MP'],['Battery','5050 mAh']]),
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation, 30-hour battery, multipoint connection, and crystal-clear call quality.',
    price: 349, originalPrice: 399, category: 'Audio', brand: 'Sony', stock: 50,
    isFeatured: true, isNewArrival: false, rating: 4.9, numReviews: 487,
    images: [{ url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80' }],
    specifications: new Map([['Driver','30mm'],['Battery','30 hours'],['ANC','Yes, 8 microphones'],['Connectivity','Bluetooth 5.2, 3.5mm']]),
  },
  {
    name: 'Apple AirPods Pro 2',
    description: 'AirPods Pro 2 with H2 chip, Adaptive Audio, Personalized Spatial Audio, and up to 30 hours total battery.',
    price: 249, originalPrice: 279, category: 'Audio', brand: 'Apple', stock: 60,
    isFeatured: true, isNewArrival: false, rating: 4.8, numReviews: 632,
    images: [{ url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80' }],
    specifications: new Map([['Chip','H2'],['ANC','Adaptive Transparency'],['Battery','6h + 24h case'],['Fit','In-ear with ear tips']]),
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'iPad Pro with M2 chip, Liquid Retina XDR display, Apple Pencil hover, and Thunderbolt connectivity.',
    price: 1099, originalPrice: 1199, category: 'Tablets', brand: 'Apple', stock: 22,
    isFeatured: true, isNewArrival: false, rating: 4.8, numReviews: 198,
    images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80' }],
    specifications: new Map([['Chip','M2'],['Display','12.9" Liquid Retina XDR'],['Storage','256GB'],['Connectivity','5G + Wi-Fi 6E']]),
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Galaxy Tab S9 Ultra with 14.6" Dynamic AMOLED, S Pen included, Snapdragon 8 Gen 2 for maximum productivity.',
    price: 1199, originalPrice: 1299, category: 'Tablets', brand: 'Samsung', stock: 15,
    isFeatured: false, isNewArrival: true, rating: 4.7, numReviews: 134,
    images: [{ url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80' }],
    specifications: new Map([['Chip','Snapdragon 8 Gen 2'],['Display','14.6" 120Hz AMOLED'],['RAM','12GB'],['S Pen','Included']]),
  },
  {
    name: 'Razer DeathAdder V3 Pro',
    description: 'Ultra-lightweight wireless gaming mouse, 90-hour battery, Focus Pro 30K Optical sensor, 5 programmable buttons.',
    price: 149, originalPrice: 179, category: 'Gaming', brand: 'Razer', stock: 45,
    isFeatured: true, isNewArrival: false, rating: 4.7, numReviews: 289,
    images: [{ url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80' }],
    specifications: new Map([['Sensor','Focus Pro 30K'],['DPI','Up to 30,000'],['Battery','90 hours'],['Weight','64g']]),
  },
  {
    name: 'Logitech G Pro X Superlight 2',
    description: 'Pro-grade wireless gaming mouse used by esports pros. HERO 2 sensor, 95-hour battery, under 60g.',
    price: 159, originalPrice: 189, category: 'Gaming', brand: 'Logitech', stock: 38,
    isFeatured: false, isNewArrival: true, rating: 4.8, numReviews: 341,
    images: [{ url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80' }],
    specifications: new Map([['Sensor','HERO 2 25K'],['DPI','100-25,600'],['Battery','95 hours'],['Weight','<60g']]),
  },
  {
    name: 'Sony PlayStation 5 Console',
    description: 'Experience lightning-fast loading, deeper immersion with haptic feedback and adaptive triggers on PS5.',
    price: 499, originalPrice: 499, category: 'Gaming', brand: 'Sony', stock: 10,
    isFeatured: true, isNewArrival: false, rating: 4.9, numReviews: 1024,
    images: [{ url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80' }],
    specifications: new Map([['CPU','AMD Zen 2 8-core'],['GPU','10.28 TFLOPS RDNA 2'],['Storage','825GB SSD'],['Resolution','Up to 8K']]),
  },
  {
    name: 'Samsung 49" Odyssey G9',
    description: 'Curved gaming monitor with 1000R curvature, 240Hz refresh rate, QLED, and NVIDIA G-Sync compatible.',
    price: 999, originalPrice: 1299, category: 'Gaming', brand: 'Samsung', stock: 8,
    isFeatured: true, isNewArrival: false, rating: 4.6, numReviews: 167,
    images: [{ url: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80' }],
    specifications: new Map([['Size','49"'],['Resolution','5120x1440 (DQHD)'],['Refresh Rate','240Hz'],['Panel','QLED VA']]),
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Apple Watch Series 9 with S9 chip, Double Tap gesture, brighter display, carbon neutral option.',
    price: 399, originalPrice: 429, category: 'Wearables', brand: 'Apple', stock: 55,
    isFeatured: true, isNewArrival: true, rating: 4.8, numReviews: 412,
    images: [{ url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80' }],
    specifications: new Map([['Chip','S9 SiP'],['Display','45mm Always-On Retina'],['Battery','18 hours'],['Health','ECG, Blood Oxygen, Temperature']]),
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic',
    description: 'Galaxy Watch 6 Classic with rotating bezel, body composition analysis, advanced sleep coaching.',
    price: 349, originalPrice: 399, category: 'Wearables', brand: 'Samsung', stock: 32,
    isFeatured: false, isNewArrival: true, rating: 4.6, numReviews: 198,
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' }],
    specifications: new Map([['Display','1.47" Super AMOLED'],['Battery','300 mAh'],['Bezel','Rotating mechanical'],['Health','BIA, ECG, Blood Pressure']]),
  },
  {
    name: 'Sony A7 IV Mirrorless Camera',
    description: 'Sony Alpha A7 IV with 33MP full-frame sensor, 4K 60p video, real-time AF with subject recognition.',
    price: 2499, originalPrice: 2799, category: 'Cameras', brand: 'Sony', stock: 12,
    isFeatured: true, isNewArrival: false, rating: 4.9, numReviews: 234,
    images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80' }],
    specifications: new Map([['Sensor','33MP Full-Frame BSI CMOS'],['Video','4K 60p, 10-bit 4:2:2'],['AF','759-point Phase Detection'],['ISO','100-51200']]),
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: 'Canon EOS R6 Mark II — 40fps burst, 6K RAW video, dual card slots, and advanced IS for sharp shots.',
    price: 2499, originalPrice: 2699, category: 'Cameras', brand: 'Canon', stock: 9,
    isFeatured: false, isNewArrival: true, rating: 4.8, numReviews: 178,
    images: [{ url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80' }],
    specifications: new Map([['Sensor','24.2MP Full-Frame CMOS'],['Burst','40fps electronic'],['Video','6K RAW internal'],['Stabilization','8-stop IS']]),
  },
  {
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Full-size mechanical keyboard with Cherry MX switches, per-key RGB, USB passthrough, and aluminium body.',
    price: 129, originalPrice: 159, category: 'Accessories', brand: 'Razer', stock: 65,
    isFeatured: false, isNewArrival: true, rating: 4.5, numReviews: 389,
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' }],
    specifications: new Map([['Switch','Cherry MX Red'],['Layout','Full-size 104-key'],['Backlight','Per-key RGB'],['Connection','USB-C']]),
  },
  {
    name: 'Anker 26,800mAh Power Bank',
    description: 'Anker PowerCore 26800mAh with 65W USB-C PD output, charges laptops, phones, and tablets simultaneously.',
    price: 79, originalPrice: 99, category: 'Accessories', brand: 'Anker', stock: 85,
    isFeatured: false, isNewArrival: false, rating: 4.7, numReviews: 521,
    images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80' }],
    specifications: new Map([['Capacity','26,800mAh'],['Output','65W USB-C PD'],['Ports','1x USB-C, 2x USB-A'],['Weight','490g']]),
  },
  {
    name: 'Samsung 55" QLED 4K TV',
    description: 'Samsung QLED 4K Smart TV with Quantum Dot technology, 120Hz, Gaming Hub, and Ambient Mode.',
    price: 799, originalPrice: 999, category: 'TVs', brand: 'Samsung', stock: 14,
    isFeatured: true, isNewArrival: false, rating: 4.7, numReviews: 312,
    images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=600&q=80' }],
    specifications: new Map([['Size','55"'],['Resolution','4K UHD (3840x2160)'],['Panel','QLED'],['Refresh Rate','120Hz'],['HDR','HDR10+']]),
  },
  {
    name: 'LG C3 OLED 65" evo',
    description: 'LG C3 OLED evo with α9 Gen6 AI Processor, Dolby Vision IQ, NVIDIA G-Sync, FreeSync Premium Pro.',
    price: 1799, originalPrice: 2199, category: 'TVs', brand: 'LG', stock: 7,
    isFeatured: true, isNewArrival: false, rating: 4.9, numReviews: 445,
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' }],
    specifications: new Map([['Size','65"'],['Panel','OLED evo'],['Processor','α9 Gen6 AI'],['Gaming','G-Sync, FreeSync, 4x HDMI 2.1']]),
  },
  {
    name: 'AMD Ryzen 9 7950X Processor',
    description: '16-core, 32-thread desktop processor. 4.5GHz base, 5.7GHz boost. Ultimate workstation performance.',
    price: 699, originalPrice: 799, category: 'Components', brand: 'AMD', stock: 20,
    isFeatured: false, isNewArrival: false, rating: 4.8, numReviews: 267,
    images: [{ url: 'https://images.unsplash.com/photo-1555617981-dac3772603c5?w=600&q=80' }],
    specifications: new Map([['Cores','16 cores / 32 threads'],['Base Clock','4.5GHz'],['Boost Clock','5.7GHz'],['TDP','170W'],['Socket','AM5']]),
  },
  {
    name: 'NVIDIA GeForce RTX 4080 Super',
    description: 'RTX 4080 Super with 16GB GDDR6X, DLSS 3.5, Ada Lovelace architecture — ultimate 4K gaming GPU.',
    price: 999, originalPrice: 1199, category: 'Components', brand: 'NVIDIA', stock: 11,
    isFeatured: true, isNewArrival: true, rating: 4.9, numReviews: 389,
    images: [{ url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80' }],
    specifications: new Map([['VRAM','16GB GDDR6X'],['CUDA Cores','10,240'],['Boost Clock','2.55GHz'],['TDP','320W'],['Outputs','3x DP 1.4, 1x HDMI 2.1']]),
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@techzone.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin', email: 'admin@techzone.com', password: 'admin123', role: 'admin' });
      console.log('👤 Admin created — email: admin@techzone.com  password: admin123');
    }

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seedDB();
