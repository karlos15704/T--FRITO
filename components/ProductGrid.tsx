import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils';
import { Plus } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-y-auto h-full bg-orange-50/50">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-lg hover:shadow-orange-100 transition-all cursor-pointer group transform hover:-translate-y-1"
          onClick={() => onAddToCart(product)}
        >
          <div className="relative h-32 md:h-40 w-full overflow-hidden bg-gray-100">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-orange-500 rounded-full p-2">
                <Plus className="text-white w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1 group-hover:text-orange-600 transition-colors">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{product.category}</p>
            <p className="font-black text-lg text-orange-600">{formatCurrency(product.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;