import React, { useState, useMemo } from 'react';
import { CartItem, PaymentMethod } from '../types';
import { formatCurrency } from '../utils';
import { MASCOT_URL } from '../constants';
import { X, Trash2, ShoppingCart, CreditCard, Banknote, QrCode, Lock, Unlock, Plus, Minus } from 'lucide-react';

interface CartSidebarProps {
  cart: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
  onCheckout: (discount: number, method: PaymentMethod) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ cart, onRemoveItem, onUpdateQuantity, onClearCart, onCheckout }) => {
  const [discountValue, setDiscountValue] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  // Discount Security State
  const [isDiscountUnlocked, setIsDiscountUnlocked] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const discount = parseFloat(discountValue) || 0;
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    if (!selectedMethod) return;
    onCheckout(discount, selectedMethod);
    // Reset local state
    setDiscountValue('');
    setSelectedMethod(null);
    setIsDiscountUnlocked(false);
    setShowPasswordInput(false);
    setPasswordAttempt('');
  };

  const handleUnlockDiscount = () => {
    if (passwordAttempt === '15704') {
      setIsDiscountUnlocked(true);
      setShowPasswordInput(false);
      setPasswordAttempt('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordAttempt('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 bg-white border-l border-orange-100 relative overflow-hidden">
        {/* Mascot Image with Animation */}
        <div className="mb-6 relative w-48 h-48">
          <div className="absolute inset-0 bg-orange-100 rounded-full blur-2xl opacity-50 transform scale-110"></div>
          {/* Added mix-blend-multiply to simulate background removal */}
          <img 
            src={MASCOT_URL} 
            alt="Mascote Tô Frito" 
            className="w-full h-full object-contain relative z-10 animate-mascot mix-blend-multiply"
          />
        </div>
        
        <p className="text-xl font-bold text-gray-600 mb-2 font-display">TÔ DE BOA...</p>
        <p className="text-sm text-gray-400 text-center max-w-[200px]">
          O mascote está relaxando porque ainda não tem pedidos. Bora vender!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-orange-200 shadow-xl z-20">
      {/* Header */}
      <div className="p-4 border-b border-orange-100 flex justify-between items-center bg-orange-50">
        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <ShoppingCart size={20} className="text-orange-600" />
          Pedido ({cart.reduce((a, b) => a + b.quantity, 0)})
        </h2>
        <button 
          onClick={onClearCart}
          className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-colors"
          title="Limpar carrinho"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 items-center bg-white border border-orange-100 p-3 rounded-lg shadow-sm group">
            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover border border-orange-200" />
            
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <h4 className="font-medium text-gray-800 truncate leading-tight">{item.name}</h4>
              
              <div className="flex items-end justify-between mt-2">
                {/* Quantity Controls */}
                <div className="flex items-center bg-orange-50 rounded-lg border border-orange-100">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 hover:bg-orange-200 rounded-l-lg text-orange-700 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 hover:bg-orange-200 rounded-r-lg text-orange-700 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">{formatCurrency(item.price)} un</div>
                  <div className="text-sm font-bold text-orange-600">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onRemoveItem(item.id)}
              className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors self-start"
              title="Remover Item"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Checkout Section */}
      <div className="p-4 bg-white border-t border-orange-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          {/* Discount Logic */}
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
            {!isDiscountUnlocked ? (
               !showPasswordInput ? (
                <button 
                  onClick={() => setShowPasswordInput(true)}
                  className="w-full flex items-center justify-between text-orange-700 text-sm font-medium hover:text-orange-800 transition-colors"
                >
                  <span className="flex items-center gap-2"><Lock size={14}/> Adicionar Desconto</span>
                  <span className="text-xs bg-orange-200 px-2 py-0.5 rounded text-orange-800">Gerente</span>
                </button>
               ) : (
                 <div className="flex gap-2">
                   <div className="flex-1">
                     <input 
                       type="password"
                       placeholder="Senha Gerencial"
                       className={`w-full text-sm p-1.5 border rounded focus:outline-none ${passwordError ? 'border-red-500 bg-red-50 placeholder-red-400' : 'border-orange-200'}`}
                       value={passwordAttempt}
                       onChange={(e) => setPasswordAttempt(e.target.value)}
                       autoFocus
                     />
                   </div>
                   <button 
                    onClick={handleUnlockDiscount}
                    className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-700"
                   >
                     OK
                   </button>
                   <button 
                    onClick={() => { setShowPasswordInput(false); setPasswordError(false); }}
                    className="text-gray-500 hover:text-gray-700"
                   >
                     <X size={16} />
                   </button>
                 </div>
               )
            ) : (
              <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                 <Unlock size={16} className="text-green-600" />
                 <input 
                   type="number" 
                   placeholder="Valor do Desconto (R$)" 
                   className="w-full text-sm p-1.5 border border-green-200 bg-green-50 rounded focus:outline-none focus:border-green-500 text-green-800 placeholder-green-700/50"
                   value={discountValue}
                   onChange={(e) => setDiscountValue(e.target.value)}
                   autoFocus
                 />
                 <button 
                   onClick={() => { setIsDiscountUnlocked(false); setDiscountValue(''); }}
                   className="text-gray-400 hover:text-red-500"
                   title="Remover desconto"
                 >
                   <X size={16} />
                 </button>
              </div>
            )}
          </div>

          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-dashed border-gray-300">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button 
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${selectedMethod === PaymentMethod.CREDIT ? 'bg-orange-100 border-orange-500 text-orange-800 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-200'}`}
            onClick={() => setSelectedMethod(PaymentMethod.CREDIT)}
          >
            <CreditCard size={20} className="mb-1" />
            Crédito
          </button>
          <button 
             className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${selectedMethod === PaymentMethod.DEBIT ? 'bg-orange-100 border-orange-500 text-orange-800 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-200'}`}
             onClick={() => setSelectedMethod(PaymentMethod.DEBIT)}
          >
            <CreditCard size={20} className="mb-1" />
            Débito
          </button>
          <button 
             className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${selectedMethod === PaymentMethod.CASH ? 'bg-orange-100 border-orange-500 text-orange-800 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-200'}`}
             onClick={() => setSelectedMethod(PaymentMethod.CASH)}
          >
            <Banknote size={20} className="mb-1" />
            Dinheiro
          </button>
          <button 
             className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${selectedMethod === PaymentMethod.PIX ? 'bg-orange-100 border-orange-500 text-orange-800 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-200'}`}
             onClick={() => setSelectedMethod(PaymentMethod.PIX)}
          >
            <QrCode size={20} className="mb-1" />
            Pix
          </button>
        </div>

        <button 
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transform active:scale-95"
          disabled={!selectedMethod}
          onClick={handleCheckout}
        >
          {selectedMethod ? 'Confirmar Pedido' : 'Selecione Pagamento'}
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;