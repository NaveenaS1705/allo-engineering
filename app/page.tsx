'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  rating: number;
  reviews: number;
  brand: string;
  specs?: string;
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
  distance?: string;
}

interface Stock {
  productId: string;
  warehouseId: string;
  available: number;
}

interface Reservation {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  expiresAt: string;
  status: 'pending' | 'confirmed' | 'released';
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMyReservations, setShowMyReservations] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    const savedProducts = localStorage.getItem('products');
    const savedWarehouses = localStorage.getItem('warehouses');
    const savedStock = localStorage.getItem('stock');
    const savedReservations = localStorage.getItem('reservations');
    
    if (savedProducts && savedWarehouses && savedStock) {
      setProducts(JSON.parse(savedProducts));
      setWarehouses(JSON.parse(savedWarehouses));
      setStock(JSON.parse(savedStock));
      setReservations(savedReservations ? JSON.parse(savedReservations) : []);
    } else {
      initializeSampleData();
    }
  };

  const initializeSampleData = () => {
    // 60+ Products including Laptops, Mobiles, Chargers, Cases, etc.
    const sampleProducts: Product[] = [
      // ========== LAPTOPS ==========
      { id: 'lap1', name: 'MacBook Pro 14"', sku: 'LAP-001', description: 'Apple M3 chip, 16GB RAM, 512GB SSD, 14-inch Liquid Retina XDR display', price: 1999.99, category: 'Laptops', image: '💻', rating: 4.9, reviews: 1234, brand: 'Apple', specs: 'M3, 16GB, 512GB' },
      { id: 'lap2', name: 'MacBook Air 13"', sku: 'LAP-002', description: 'Apple M2 chip, 8GB RAM, 256GB SSD, lightweight design', price: 1099.99, category: 'Laptops', image: '💻', rating: 4.8, reviews: 2345, brand: 'Apple', specs: 'M2, 8GB, 256GB' },
      { id: 'lap3', name: 'Dell XPS 15', sku: 'LAP-003', description: 'Intel i7, 16GB RAM, 512GB SSD, 15.6-inch 4K OLED', price: 1799.99, category: 'Laptops', image: '💻', rating: 4.7, reviews: 567, brand: 'Dell', specs: 'i7, 16GB, 512GB' },
      { id: 'lap4', name: 'HP Spectre x360', sku: 'LAP-004', description: 'Intel i7, 16GB RAM, 1TB SSD, 2-in-1 convertible', price: 1499.99, category: 'Laptops', image: '💻', rating: 4.6, reviews: 432, brand: 'HP', specs: 'i7, 16GB, 1TB' },
      { id: 'lap5', name: 'Lenovo ThinkPad X1', sku: 'LAP-005', description: 'Intel i7, 32GB RAM, 1TB SSD, business laptop', price: 1699.99, category: 'Laptops', image: '💻', rating: 4.8, reviews: 876, brand: 'Lenovo', specs: 'i7, 32GB, 1TB' },
      { id: 'lap6', name: 'Asus ROG Zephyrus', sku: 'LAP-006', description: 'Intel i9, 32GB RAM, 1TB SSD, RTX 4080, gaming laptop', price: 2499.99, category: 'Laptops', image: '🎮', rating: 4.9, reviews: 345, brand: 'Asus', specs: 'i9, 32GB, RTX 4080' },
      { id: 'lap7', name: 'Acer Swift 3', sku: 'LAP-007', description: 'AMD Ryzen 7, 16GB RAM, 512GB SSD,轻薄设计', price: 799.99, category: 'Laptops', image: '💻', rating: 4.5, reviews: 654, brand: 'Acer', specs: 'Ryzen 7, 16GB, 512GB' },
      { id: 'lap8', name: 'Microsoft Surface Laptop', sku: 'LAP-008', description: 'Intel i5, 8GB RAM, 256GB SSD, touchscreen', price: 999.99, category: 'Laptops', image: '💻', rating: 4.6, reviews: 543, brand: 'Microsoft', specs: 'i5, 8GB, 256GB' },
      
      // ========== MOBILES / SMARTPHONES ==========
      { id: 'mob1', name: 'iPhone 15 Pro Max', sku: 'MOB-001', description: '6.7-inch display, 256GB, A17 Pro chip, Titanium design', price: 1199.99, category: 'Mobiles', image: '📱', rating: 4.9, reviews: 5678, brand: 'Apple', specs: '256GB, A17 Pro' },
      { id: 'mob2', name: 'iPhone 15 Pro', sku: 'MOB-002', description: '6.1-inch display, 128GB, A17 Pro chip, Action button', price: 999.99, category: 'Mobiles', image: '📱', rating: 4.8, reviews: 4321, brand: 'Apple', specs: '128GB, A17 Pro' },
      { id: 'mob3', name: 'iPhone 15', sku: 'MOB-003', description: '6.1-inch display, 128GB, A16 Bionic, Dynamic Island', price: 799.99, category: 'Mobiles', image: '📱', rating: 4.7, reviews: 3456, brand: 'Apple', specs: '128GB, A16' },
      { id: 'mob4', name: 'Samsung Galaxy S24 Ultra', sku: 'MOB-004', description: '6.8-inch, 256GB, 200MP camera, S Pen included', price: 1299.99, category: 'Mobiles', image: '📱', rating: 4.8, reviews: 2345, brand: 'Samsung', specs: '256GB, 200MP' },
      { id: 'mob5', name: 'Samsung Galaxy S24+', sku: 'MOB-005', description: '6.7-inch, 256GB, 50MP camera, AI features', price: 999.99, category: 'Mobiles', image: '📱', rating: 4.7, reviews: 1234, brand: 'Samsung', specs: '256GB, AI' },
      { id: 'mob6', name: 'Google Pixel 8 Pro', sku: 'MOB-006', description: '6.7-inch, 128GB, Tensor G3, Best camera', price: 899.99, category: 'Mobiles', image: '📱', rating: 4.8, reviews: 987, brand: 'Google', specs: '128GB, Tensor G3' },
      { id: 'mob7', name: 'Google Pixel 8', sku: 'MOB-007', description: '6.2-inch, 128GB, AI-powered, 7 years updates', price: 699.99, category: 'Mobiles', image: '📱', rating: 4.7, reviews: 876, brand: 'Google', specs: '128GB, AI' },
      { id: 'mob8', name: 'OnePlus 12', sku: 'MOB-008', description: '6.8-inch, 256GB, Snapdragon 8 Gen 3, 100W charging', price: 799.99, category: 'Mobiles', image: '📱', rating: 4.6, reviews: 765, brand: 'OnePlus', specs: '256GB, 8 Gen 3' },
      { id: 'mob9', name: 'Xiaomi 14 Pro', sku: 'MOB-009', description: '6.73-inch, 256GB, Leica camera, HyperOS', price: 899.99, category: 'Mobiles', image: '📱', rating: 4.6, reviews: 654, brand: 'Xiaomi', specs: '256GB, Leica' },
      { id: 'mob10', name: 'Nothing Phone 2', sku: 'MOB-010', description: '6.7-inch, 256GB, Glyph interface, unique design', price: 599.99, category: 'Mobiles', image: '📱', rating: 4.5, reviews: 543, brand: 'Nothing', specs: '256GB, Glyph' },
      
      // ========== CHARGERS & CABLES ==========
      { id: 'chg1', name: 'Apple 20W USB-C Charger', sku: 'CHG-001', description: 'Fast charging, compatible with iPhone and iPad', price: 19.99, category: 'Chargers', image: '🔌', rating: 4.5, reviews: 2345, brand: 'Apple', specs: '20W, USB-C' },
      { id: 'chg2', name: '65W GaN Charger', sku: 'CHG-002', description: '3 ports, fast charging for laptop and phone', price: 39.99, category: 'Chargers', image: '🔌', rating: 4.7, reviews: 1234, brand: 'Anker', specs: '65W, GaN' },
      { id: 'chg3', name: 'MagSafe Wireless Charger', sku: 'CHG-003', description: '15W fast wireless charging for iPhone', price: 39.99, category: 'Chargers', image: '🔌', rating: 4.6, reviews: 987, brand: 'Apple', specs: '15W, MagSafe' },
      { id: 'chg4', name: '3-in-1 Charging Station', sku: 'CHG-004', description: 'Charge iPhone, Apple Watch, AirPods simultaneously', price: 49.99, category: 'Chargers', image: '🔌', rating: 4.8, reviews: 876, brand: 'Belkin', specs: '3-in-1, 15W' },
      { id: 'chg5', name: 'USB-C to USB-C Cable', sku: 'CHG-005', description: '6ft, 100W, braided, fast charging', price: 12.99, category: 'Chargers', image: '🔌', rating: 4.4, reviews: 2345, brand: 'Anker', specs: '6ft, 100W' },
      { id: 'chg6', name: 'Lightning Cable', sku: 'CHG-006', description: '6ft, MFi certified, durable design', price: 14.99, category: 'Chargers', image: '🔌', rating: 4.3, reviews: 3456, brand: 'Apple', specs: '6ft, MFi' },
      
      // ========== MOBILE BACK CASES ==========
      { id: 'cas1', name: 'iPhone 15 Pro Silicone Case', sku: 'CAS-001', description: 'Apple official, magnetic, soft-touch finish', price: 49.99, category: 'Cases', image: '📱', rating: 4.5, reviews: 2345, brand: 'Apple', specs: 'Silicone, MagSafe' },
      { id: 'cas2', name: 'Clear Magnetic Case', sku: 'CAS-002', description: 'Shockproof, MagSafe compatible, yellowing resistant', price: 24.99, category: 'Cases', image: '📱', rating: 4.4, reviews: 1234, brand: 'Spigen', specs: 'Clear, Magnetic' },
      { id: 'cas3', name: 'Leather Wallet Case', sku: 'CAS-003', description: 'Genuine leather, card holder, kickstand', price: 34.99, category: 'Cases', image: '📱', rating: 4.3, reviews: 876, brand: 'Nomad', specs: 'Leather, Wallet' },
      { id: 'cas4', name: 'Rugged Armor Case', sku: 'CAS-004', description: 'Military grade protection, carbon fiber design', price: 19.99, category: 'Cases', image: '🛡️', rating: 4.7, reviews: 3456, brand: 'Spigen', specs: 'Rugged, Military' },
      { id: 'cas5', name: 'Samsung S24 Ultra Case', sku: 'CAS-005', description: 'Built-in S Pen holder, kickstand, rugged', price: 29.99, category: 'Cases', image: '📱', rating: 4.6, reviews: 987, brand: 'Samsung', specs: 'S Pen, Rugged' },
      { id: 'cas6', name: 'Camera Lens Protector', sku: 'CAS-006', description: 'Tempered glass, aluminum ring, for iPhone', price: 12.99, category: 'Cases', image: '📷', rating: 4.2, reviews: 2345, brand: 'ESR', specs: 'Glass, Aluminum' },
      
      // ========== WIRED HEADPHONES ==========
      { id: 'hed1', name: 'Wired Earphones', sku: 'HED-001', description: 'Apple EarPods, Lightning connector, built-in remote', price: 19.99, category: 'Headphones', image: '🎧', rating: 4.3, reviews: 5678, brand: 'Apple', specs: 'Lightning, Wired' },
      { id: 'hed2', name: 'USB-C Earphones', sku: 'HED-002', description: 'Digital sound, noise isolation, in-line controls', price: 19.99, category: 'Headphones', image: '🎧', rating: 4.2, reviews: 2345, brand: 'Samsung', specs: 'USB-C, Wired' },
      { id: 'hed3', name: 'Studio Headphones', sku: 'HED-003', description: 'Over-ear, professional monitoring, 3m cable', price: 99.99, category: 'Headphones', image: '🎧', rating: 4.7, reviews: 1234, brand: 'Sony', specs: 'Over-ear, Professional' },
      { id: 'hed4', name: 'Gaming Headset Wired', sku: 'HED-004', description: '7.1 surround sound, noise-canceling mic', price: 49.99, category: 'Headphones', image: '🎮', rating: 4.6, reviews: 3456, brand: 'HyperX', specs: '7.1, Gaming' },
      { id: 'hed5', name: 'In-Ear Monitors', sku: 'HED-005', description: 'Hi-Fi sound, detachable cable, 3.5mm', price: 79.99, category: 'Headphones', image: '🎧', rating: 4.8, reviews: 987, brand: 'Shure', specs: 'IEM, Hi-Fi' },
      
      // ========== MORE ELECTRONICS ==========
      { id: 'elec1', name: 'Smart Watch', sku: 'ELE-001', description: 'Apple Watch Series 9, GPS, 45mm', price: 429.99, category: 'Electronics', image: '⌚', rating: 4.8, reviews: 4567, brand: 'Apple', specs: 'GPS, 45mm' },
      { id: 'elec2', name: 'iPad Air', sku: 'ELE-002', description: '10.9-inch, M1 chip, 64GB, WiFi', price: 599.99, category: 'Electronics', image: '📱', rating: 4.8, reviews: 3456, brand: 'Apple', specs: 'M1, 64GB' },
      { id: 'elec3', name: 'AirPods Pro 2', sku: 'ELE-003', description: 'Active noise cancellation, transparency mode, MagSafe', price: 249.99, category: 'Electronics', image: '🎧', rating: 4.9, reviews: 7890, brand: 'Apple', specs: 'ANC, MagSafe' },
      { id: 'elec4', name: 'External Hard Drive', sku: 'ELE-004', description: '2TB, USB 3.0, portable backup', price: 79.99, category: 'Electronics', image: '💾', rating: 4.4, reviews: 2345, brand: 'WD', specs: '2TB, USB 3.0' },
      { id: 'elec5', name: 'Wireless Router', sku: 'ELE-005', description: 'WiFi 6, dual-band, gaming router', price: 199.99, category: 'Electronics', image: '📡', rating: 4.6, reviews: 1234, brand: 'Asus', specs: 'WiFi 6, Gaming' },
      { id: 'elec6', name: 'Webcam 4K', sku: 'ELE-006', description: '4K Ultra HD, autofocus, built-in mic', price: 129.99, category: 'Electronics', image: '📹', rating: 4.5, reviews: 987, brand: 'Logitech', specs: '4K, Autofocus' },
      { id: 'elec7', name: 'Drawing Tablet', sku: 'ELE-007', description: '10-inch, 8192 pressure levels, wireless', price: 199.99, category: 'Electronics', image: '✍️', rating: 4.7, reviews: 876, brand: 'Wacom', specs: '10-inch, Wireless' },
      { id: 'elec8', name: 'Smart Speaker', sku: 'ELE-008', description: 'Echo Dot 5th gen, with clock, Alexa', price: 59.99, category: 'Electronics', image: '🔊', rating: 4.5, reviews: 3456, brand: 'Amazon', specs: 'Alexa, Clock' },
      { id: 'elec9', name: 'Fitness Tracker', sku: 'ELE-009', description: 'Fitbit Charge 6, heart rate, GPS', price: 159.99, category: 'Electronics', image: '⌚', rating: 4.5, reviews: 2345, brand: 'Fitbit', specs: 'GPS, Heart Rate' },
      { id: 'elec10', name: 'Portable Projector', sku: 'ELE-010', description: '1080p, 200 ANSI lumens, battery powered', price: 299.99, category: 'Electronics', image: '📽️', rating: 4.4, reviews: 654, brand: 'Anker', specs: '1080p, Portable' },
      
      // ========== POWER BANKS ==========
      { id: 'pow1', name: '20,000mAh Power Bank', sku: 'POW-001', description: 'Fast charging, 3 ports, digital display', price: 39.99, category: 'Power Banks', image: '🔋', rating: 4.6, reviews: 3456, brand: 'Anker', specs: '20000mAh, PD' },
      { id: 'pow2', name: 'Magnetic Power Bank', sku: 'POW-002', description: '5000mAh, MagSafe compatible, slim design', price: 49.99, category: 'Power Banks', image: '🔋', rating: 4.5, reviews: 2345, brand: 'Apple', specs: '5000mAh, MagSafe' },
      { id: 'pow3', name: 'Solar Power Bank', sku: 'POW-003', description: '25000mAh, solar charging, waterproof', price: 59.99, category: 'Power Banks', image: '🔋', rating: 4.4, reviews: 1234, brand: 'Anker', specs: '25000mAh, Solar' },
      
      // ========== SCREEN PROTECTORS ==========
      { id: 'scr1', name: 'iPhone Screen Protector', sku: 'SCR-001', description: 'Privacy filter, tempered glass, 9H hardness', price: 14.99, category: 'Screen Protectors', image: '🛡️', rating: 4.4, reviews: 4567, brand: 'Belkin', specs: 'Privacy, 9H' },
      { id: 'scr2', name: 'Samsung Screen Protector', sku: 'SCR-002', description: 'Ultrasonic fingerprint compatible, case-friendly', price: 16.99, category: 'Screen Protectors', image: '🛡️', rating: 4.3, reviews: 2345, brand: 'Spigen', specs: 'FP Compatible' },
      { id: 'scr3', name: 'Matte Screen Protector', sku: 'SCR-003', description: 'Anti-glare, fingerprint resistant, paper-like feel', price: 12.99, category: 'Screen Protectors', image: '🛡️', rating: 4.2, reviews: 1234, brand: 'Paperlike', specs: 'Matte, Anti-glare' },
      
      // ========== SMART HOME ==========
      { id: 'smt1', name: 'Smart Bulb', sku: 'SMT-001', description: 'Color changing, 16 million colors, voice control', price: 19.99, category: 'Smart Home', image: '💡', rating: 4.5, reviews: 3456, brand: 'Philips', specs: 'Color, Voice' },
      { id: 'smt2', name: 'Smart Plug', sku: 'SMT-002', description: 'WiFi enabled, energy monitoring, schedule', price: 14.99, category: 'Smart Home', image: '🔌', rating: 4.4, reviews: 2345, brand: 'TP-Link', specs: 'WiFi, Energy' },
      { id: 'smt3', name: 'Security Camera', sku: 'SMT-003', description: '2K, night vision, motion tracking', price: 49.99, category: 'Smart Home', image: '📹', rating: 4.6, reviews: 1234, brand: 'Ring', specs: '2K, Motion' },
      
      // ========== GAMING ACCESSORIES ==========
      { id: 'gam1', name: 'Gaming Mouse', sku: 'GAM-001', description: 'RGB, 16000 DPI, programmable buttons', price: 49.99, category: 'Gaming', image: '🖱️', rating: 4.7, reviews: 2345, brand: 'Razer', specs: 'RGB, 16K DPI' },
      { id: 'gam2', name: 'Gaming Keyboard', sku: 'GAM-002', description: 'Mechanical, RGB backlit, wrist rest', price: 89.99, category: 'Gaming', image: '⌨️', rating: 4.7, reviews: 1876, brand: 'Corsair', specs: 'Mechanical, RGB' },
      { id: 'gam3', name: 'Gaming Controller', sku: 'GAM-003', description: 'Wireless, haptic feedback, Xbox layout', price: 59.99, category: 'Gaming', image: '🎮', rating: 4.6, reviews: 3456, brand: 'Xbox', specs: 'Wireless, Haptic' },
    ];
    
    // Warehouses
    const sampleWarehouses: Warehouse[] = [
      { id: 'w1', name: 'North Warehouse', location: 'New York, NY', distance: '2 days' },
      { id: 'w2', name: 'South Warehouse', location: 'Austin, TX', distance: '3 days' },
      { id: 'w3', name: 'West Warehouse', location: 'Los Angeles, CA', distance: '4 days' },
      { id: 'w4', name: 'East Warehouse', location: 'Miami, FL', distance: '3 days' },
      { id: 'w5', name: 'Central Warehouse', location: 'Chicago, IL', distance: '3 days' },
      { id: 'w6', name: 'Northwest Warehouse', location: 'Seattle, WA', distance: '5 days' },
      { id: 'w7', name: 'Southwest Warehouse', location: 'Phoenix, AZ', distance: '4 days' },
    ];
    
    // Stock levels for all products across warehouses
    const sampleStock: Stock[] = [];
    
    sampleProducts.forEach(product => {
      const warehouses = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7'];
      warehouses.forEach(warehouseId => {
        // Higher stock for popular items
        let stockAmount = Math.floor(Math.random() * 47) + 3;
        if (product.id.includes('lap') || product.id.includes('mob')) {
          stockAmount = Math.floor(Math.random() * 20) + 5; // Laptops & Mobiles: 5-25 units
        }
        sampleStock.push({
          productId: product.id,
          warehouseId: warehouseId,
          available: stockAmount
        });
      });
    });
    
    setProducts(sampleProducts);
    setWarehouses(sampleWarehouses);
    setStock(sampleStock);
    setReservations([]);
    
    localStorage.setItem('products', JSON.stringify(sampleProducts));
    localStorage.setItem('warehouses', JSON.stringify(sampleWarehouses));
    localStorage.setItem('stock', JSON.stringify(sampleStock));
    localStorage.setItem('reservations', JSON.stringify([]));
  };

  const getAvailableStock = (productId: string, warehouseId: string) => {
    const stockItem = stock.find(s => s.productId === productId && s.warehouseId === warehouseId);
    if (!stockItem) return 0;
    
    const pendingReservations = reservations.filter(
      r => r.productId === productId && 
           r.warehouseId === warehouseId && 
           r.status === 'pending' &&
           new Date(r.expiresAt) > new Date()
    );
    
    const reservedQuantity = pendingReservations.reduce((sum, r) => sum + r.quantity, 0);
    return stockItem.available - reservedQuantity;
  };

  const handleReserve = (productId: string, productName: string, warehouseId: string, warehouseName: string, quantity: number = 1) => {
    const available = getAvailableStock(productId, warehouseId);
    
    if (available < quantity) {
      alert(`Only ${available} units available!`);
      return;
    }
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    const newReservation: Reservation = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      productId,
      productName,
      warehouseId,
      warehouseName,
      quantity,
      expiresAt: expiresAt.toISOString(),
      status: 'pending',
    };
    
    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    
    alert(`✅ Reserved ${quantity} x ${productName}! You have 10 minutes to complete payment.`);
    window.location.href = `/checkout/${newReservation.id}`;
  };

  const getMyReservations = () => {
    return reservations.filter(r => r.status === 'pending' && new Date(r.expiresAt) > new Date());
  };

  const cancelReservation = (reservationId: string) => {
    const updated = reservations.map(r =>
      r.id === reservationId ? { ...r, status: 'released' } : r
    );
    setReservations(updated);
    localStorage.setItem('reservations', JSON.stringify(updated));
    alert('Reservation cancelled');
  };

  const filteredProducts = products
    .filter(p => searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => {
      if (priceRange === 'all') return true;
      if (priceRange === 'under50') return p.price < 50;
      if (priceRange === '50to100') return p.price >= 50 && p.price <= 100;
      if (priceRange === '100to500') return p.price > 100 && p.price <= 500;
      if (priceRange === 'over500') return p.price > 500;
      return true;
    })
    .filter(p => !showLowStock || getTotalStock(p.id) < 10)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const getTotalStock = (productId: string) => {
    return stock.filter(s => s.productId === productId).reduce((sum, s) => sum + s.available, 0);
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const activeReservations = getMyReservations();

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold mb-2">🛍️ Allo Reservation System</h1>
          <p className="text-gray-300">Reserve items for 10 minutes while you checkout - never lose your cart again!</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-blue-600">{products.length}</div>
            <div className="text-sm text-gray-700 font-medium">Products</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-green-600">{warehouses.length}</div>
            <div className="text-sm text-gray-700 font-medium">Warehouses</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-orange-600">{activeReservations.length}</div>
            <div className="text-sm text-gray-700 font-medium">Active Reservations</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-purple-600">
              {stock.reduce((sum, s) => sum + s.available, 0)}
            </div>
            <div className="text-sm text-gray-700 font-medium">Total Stock</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md border border-gray-200">
            <div className="text-3xl font-bold text-red-600">
              {products.filter(p => getTotalStock(p.id) < 10).length}
            </div>
            <div className="text-sm text-gray-700 font-medium">Low Stock Items</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-5 mb-6 shadow-md border border-gray-200">
          <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📂 Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">⚡ Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
              >
                <option value="all">All Prices</option>
                <option value="under50">Under $50</option>
                <option value="50to100">$50 - $100</option>
                <option value="100to500">$100 - $500</option>
                <option value="over500">Over $500</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔥 Filters</label>
              <button
                onClick={() => setShowLowStock(!showLowStock)}
                className={`w-full rounded-lg p-2 font-medium transition ${
                  showLowStock ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {showLowStock ? '✓ Low Stock Only' : 'Show Low Stock'}
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📋 My Orders</label>
              <button
                onClick={() => setShowMyReservations(!showMyReservations)}
                className="w-full bg-purple-600 text-white rounded-lg p-2 font-medium hover:bg-purple-700 transition"
              >
                {showMyReservations ? 'Hide' : `Show (${activeReservations.length})`}
              </button>
            </div>
          </div>
        </div>

        {/* Active Reservations Panel */}
        {showMyReservations && activeReservations.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 mb-6 shadow-md">
            <h2 className="font-bold text-gray-900 mb-3 text-lg">⏳ Your Active Reservations ({activeReservations.length})</h2>
            <div className="space-y-2">
              {activeReservations.map(res => {
                const timeLeft = Math.max(0, Math.floor((new Date(res.expiresAt).getTime() - Date.now()) / 1000));
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                return (
                  <div key={res.id} className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                    <div>
                      <span className="font-semibold text-gray-900">{res.productName}</span>
                      <span className="text-sm text-gray-600 ml-2">x{res.quantity}</span>
                      <span className="text-xs text-gray-500 ml-2">Expires: {minutes}:{seconds.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => window.location.href = `/checkout/${res.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => cancelReservation(res.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden">
              <div className="p-5">
                <div className="text-5xl mb-3">{product.image || '📦'}</div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                  {getTotalStock(product.id) < 10 && (
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">🔥 Low Stock</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">{product.sku}</p>
                <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                {product.specs && <p className="text-xs text-gray-400 mb-2">{product.specs}</p>}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-sm text-gray-900">{renderStars(product.rating)}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mb-2">{product.category}</span>
                <p className="text-gray-700 mt-2 text-sm leading-relaxed">{product.description.substring(0, 80)}...</p>
                <p className="text-2xl font-bold mt-3 text-green-700">${product.price}</p>
                
                <div className="mt-4 space-y-2 max-h-52 overflow-y-auto border-t border-gray-200 pt-3">
                  <h3 className="font-semibold text-sm text-gray-700">Available Stock:</h3>
                  {warehouses.map((warehouse) => {
                    const available = getAvailableStock(product.id, warehouse.id);
                    if (available === 0) return null;
                    return (
                      <div key={warehouse.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{warehouse.name}</p>
                          <p className="text-xs text-gray-500">{warehouse.location}</p>
                          <p className={`text-sm font-bold ${available <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                            {available} left {available <= 3 && '⚡ Hurry!'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            id={`qty-${product.id}-${warehouse.id}`}
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-16 text-gray-900"
                            defaultValue="1"
                          >
                            {[1,2,3].map(i => i <= available && i <= 5 && <option key={i} value={i}>{i}</option>)}
                          </select>
                          <button
                            onClick={() => {
                              const qtySelect = document.getElementById(`qty-${product.id}-${warehouse.id}`) as HTMLSelectElement;
                              const qty = parseInt(qtySelect?.value || '1');
                              handleReserve(product.id, product.name, warehouse.id, warehouse.name, qty);
                            }}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                          >
                            Reserve
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-700 text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}