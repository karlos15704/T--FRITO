import { Product } from './types';

// Mock Products - Iscas de Frango Theme
export const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Combo da Galera (Clássico + Refri)', 
    price: 18.00, 
    category: 'Combos', 
    imageUrl: 'https://images.unsplash.com/photo-1513639776629-7b611594e29b?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: '2', 
    name: "O 'Tô Frito' Clássico (150g + Molho)", 
    price: 15.00, 
    category: 'Porções', 
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: '3', 
    name: "O 'Tô Frito' Junior (100g)", 
    price: 10.00, 
    category: 'Porções', 
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: '4', 
    name: 'Refrigerante Lata 350ml', 
    price: 5.00, 
    category: 'Bebidas', 
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80' 
  },
];

export const APP_NAME = "TÔ FRITO!";

// Mascote: Link atualizado conforme solicitação
export const MASCOT_URL = "https://upnow-prod.ff45e40d1a1c8f7e7de4e976d0c9e555.r2.cloudflarestorage.com/sZfVUJbAelbb6Rfo7X2xf7SHdG82/ce188be5-d948-4b33-95f8-ef0c4dbf71c2?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2f488bd324502ec20fee5b40e9c9ed39%2F20260120%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260120T182411Z&X-Amz-Expires=43200&X-Amz-Signature=2867a71c1d85f22357320b8806b91ad6cb00ecbb40c7233926661b59538e080b&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22Captura%20de%20tela%202026-01-20%20145931%20-%20Edited.png%22";