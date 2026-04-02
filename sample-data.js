// Script para agregar datos de ejemplo a favoritos
// Ejecuta este código en la consola del navegador para ver el nuevo diseño con datos

const sampleFavorites = [
  {
    id: 'fav-1',
    title: 'MacBook Pro 13" M2',
    description: 'Laptop Apple MacBook Pro de 13 pulgadas con chip M2, 8GB RAM, 256GB SSD. Como nueva, poco uso.',
    price: 1200,
    oldPrice: 1350,
    image: 'src/frontend/images/products/macbook.jpg',
    rating: 4.9,
    sellerName: 'Ana García',
    sellerId: 'seller-1',
    sellerAvatar: 'src/frontend/images/avatars/ana.jpg',
    available: true,
    featured: true,
    priceDrop: true,
    favoriteDate: '2025-08-01T10:30:00Z'
  },
  {
    id: 'fav-2', 
    title: 'iPhone 14 Pro 128GB',
    description: 'iPhone 14 Pro en excelente estado, color morado, incluye cargador y funda original.',
    price: 850,
    image: 'src/frontend/images/products/iphone14.jpg',
    rating: 4.8,
    sellerName: 'Carlos Ruiz',
    sellerId: 'seller-2',
    sellerAvatar: 'src/frontend/images/avatars/carlos.jpg',
    available: true,
    featured: false,
    priceDrop: false,
    favoriteDate: '2025-07-28T15:20:00Z'
  },
  {
    id: 'fav-3',
    title: 'Auriculares Sony WH-1000XM4',
    description: 'Auriculares inalámbricos con cancelación de ruido, perfectos para estudiar.',
    price: 180,
    image: 'src/frontend/images/products/sony-headphones.jpg', 
    rating: 4.7,
    sellerName: 'María López',
    sellerId: 'seller-3',
    sellerAvatar: 'src/frontend/images/avatars/maria.jpg',
    available: false,
    featured: false,
    priceDrop: false,
    favoriteDate: '2025-07-25T09:15:00Z'
  },
  {
    id: 'fav-4',
    title: 'iPad Air 5ta Gen',
    description: 'iPad Air de 5ta generación, 64GB Wi-Fi, color azul cielo. Incluye Apple Pencil.',
    price: 420,
    oldPrice: 480,
    image: 'src/frontend/images/products/ipad-air.jpg',
    rating: 4.6,
    sellerName: 'Pedro Martínez',
    sellerId: 'seller-4',
    sellerAvatar: 'src/frontend/images/avatars/pedro.jpg',
    available: true,
    featured: false,
    priceDrop: true,
    favoriteDate: '2025-07-20T14:45:00Z'
  }
];

// Guardar en localStorage
localStorage.setItem('utplace-favorites', JSON.stringify(sampleFavorites));

// ...existing code...
