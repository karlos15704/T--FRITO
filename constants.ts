import { Product } from './types';

// Mock Products - Fast Food Theme
export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'X-Tudo Monstro', price: 32.90, category: 'Lanches', imageUrl: 'https://loremflickr.com/320/240/burger?random=1' },
  { id: '2', name: 'X-Bacon Crocante', price: 26.50, category: 'Lanches', imageUrl: 'https://loremflickr.com/320/240/burger?random=2' },
  { id: '3', name: 'Combo To Frito (Burguer+Batata+Refri)', price: 45.00, category: 'Combos', imageUrl: 'https://loremflickr.com/320/240/meal?random=3' },
  { id: '4', name: 'Batata Frita Suprema (Cheddar/Bacon)', price: 22.00, category: 'Porções', imageUrl: 'https://loremflickr.com/320/240/fries?random=4' },
  { id: '5', name: 'Coxinha de Frango', price: 8.50, category: 'Salgados', imageUrl: 'https://loremflickr.com/320/240/food?random=5' },
  { id: '6', name: 'Pastel de Carne', price: 9.00, category: 'Salgados', imageUrl: 'https://loremflickr.com/320/240/pastry?random=6' },
  { id: '7', name: 'Refrigerante Lata 350ml', price: 6.00, category: 'Bebidas', imageUrl: 'https://loremflickr.com/320/240/soda?random=7' },
  { id: '8', name: 'Suco Natural Laranja', price: 12.00, category: 'Bebidas', imageUrl: 'https://loremflickr.com/320/240/juice?random=8' },
  { id: '9', name: 'Açaí Completo 500ml', price: 18.00, category: 'Sobremesas', imageUrl: 'https://loremflickr.com/320/240/dessert?random=9' },
  { id: '10', name: 'Nuggets (10 unid)', price: 15.90, category: 'Porções', imageUrl: 'https://loremflickr.com/320/240/chicken?random=10' },
  { id: '11', name: 'Hot Dog Especial', price: 14.50, category: 'Lanches', imageUrl: 'https://loremflickr.com/320/240/hotdog?random=11' },
  { id: '12', name: 'Água Mineral', price: 4.00, category: 'Bebidas', imageUrl: 'https://loremflickr.com/320/240/water?random=12' },
];

export const APP_NAME = "TÔ FRITO!";

// URL atualizada para um mascote estilo 'Frango no Fogo'. 
// Se você quiser usar exatamente a imagem que enviou, faça o upload dela para um site como imgur.com e cole o link aqui.
export const MASCOT_URL = "https://cdn-icons-png.flaticon.com/512/7541/7541675.png";