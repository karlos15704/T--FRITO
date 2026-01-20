import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CartItem, PaymentMethod } from '../types';
import { formatCurrency } from '../utils';
import { MASCOT_URL } from '../constants';
import { X, Trash2, ShoppingCart, CreditCard, Banknote, QrCode, Lock, Unlock, Plus, Minus, CheckCircle2, Calculator, Delete } from 'lucide-react';

interface CartSidebarProps {
  cart: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
  onCheckout: (discount: number, method: PaymentMethod, change?: number, amountPaid?: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ cart, onRemoveItem, onUpdateQuantity, onClearCart, onCheckout }) => {
  const [discountValue, setDiscountValue] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  // Pix Modal State
  const [showPixModal, setShowPixModal] = useState(false);

  // Cash/Calculator Modal State
  const [showCashModal, setShowCashModal] = useState(false);
  const [cashReceivedStr, setCashReceivedStr] = useState<string>('');
  const cashInputRef = useRef<HTMLInputElement>(null);

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
  
  // Cash Calculations
  const cashReceived = parseFloat(cashReceivedStr.replace(',', '.')) || 0;
  const cashChange = Math.max(0, cashReceived - total);
  const missingCash = Math.max(0, total - cashReceived);

  // Configuração da Imagem do Pix (Link fornecido)
  const PIX_QR_IMAGE = "https://upnow-prod.ff45e40d1a1c8f7e7de4e976d0c9e555.r2.cloudflarestorage.com/sZfVUJbAelbb6Rfo7X2xf7SHdG82/dd07c32a-8de9-48cc-a6d6-77072b86c9d3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2f488bd324502ec20fee5b40e9c9ed39%2F20260120%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260120T211559Z&X-Amz-Expires=43200&X-Amz-Signature=219bcd365bdd21f471b94deb3cc43205f21178d9df47dfbdaa1a666489ffc516&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22Captura%20de%20tela%202026-01-20%20181523.png%22";

  // Focus input when cash modal opens
  useEffect(() => {
    if (showCashModal && cashInputRef.current) {
      cashInputRef.current.focus();
    }
  }, [showCashModal]);

  const resetState = () => {
    setDiscountValue('');
    setSelectedMethod(null);
    setShowPixModal(false);
    setShowCashModal(false);
    setCashReceivedStr('');
    setIsDiscountUnlocked(false);
    setShowPasswordInput(false);
    setPasswordAttempt('');
  };

  const handleCheckout = () => {
    if (!selectedMethod) return;
    
    // For Cash, we pass extra info
    if (selectedMethod === PaymentMethod.CASH) {
       onCheckout(discount, selectedMethod, cashChange, cashReceived);
    } else {
       onCheckout(discount, selectedMethod);
    }
    resetState();
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

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method === PaymentMethod.PIX) {
      setShowPixModal(true);
    } else if (method === PaymentMethod.CASH) {
      setShowCashModal(true);
    }
  };

  // Calculator Logic
  const handleKeypadPress = (val: string) => {
    if (val === 'C') {
      setCashReceivedStr('');
      return;
    }
    if (val === 'back') {
      setCashReceivedStr(prev => prev.slice(0, -1));
      return;
    }
    
    // Prevent multiple decimals
    if (val === ',' && cashReceivedStr.includes(',')) return;
    
    setCashReceivedStr(prev => prev + val);
  };

  const addBill = (amount: number) => {
    const current = parseFloat(cashReceivedStr.replace(',', '.')) || 0;
    const newVal = current + amount;
    setCashReceivedStr(newVal.toString().replace('.', ','));
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
            className="w-full h-full object-contain relative z-10 animate-mascot-chill mix-blend-multiply"
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
    <>
      {/* CASH CALCULATOR MODAL */}
      {showCashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 relative">
              <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                   <Calculator size={24} />
                   Calculadora de Troco
                 </h3>
                 <button onClick={() => { setShowCashModal(false); setSelectedMethod(null); }} className="hover:bg-orange-700 p-1 rounded-full transition-colors">
                   <X size={24} />
                 </button>
              </div>
              
              <div className="p-6 bg-slate-50">
                 {/* Display Section */}
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                       <p className="text-xs text-gray-500 font-bold uppercase">Total a Pagar</p>
                       <p className="text-2xl font-black text-gray-800">{formatCurrency(total)}</p>
                    </div>
                    <div className={`p-3 rounded-xl border shadow-sm ${missingCash > 0 ? 'bg-white border-red-200' : 'bg-green-100 border-green-300'}`}>
                       <p className={`text-xs font-bold uppercase ${missingCash > 0 ? 'text-gray-500' : 'text-green-700'}`}>
                         {missingCash > 0 ? 'Falta' : 'Troco'}
                       </p>
                       <p className={`text-2xl font-black ${missingCash > 0 ? 'text-red-500' : 'text-green-700'}`}>
                         {missingCash > 0 ? formatCurrency(missingCash) : formatCurrency(cashChange)}
                       </p>
                    </div>
                 </div>

                 {/* Input Display */}
                 <div className="mb-4 relative">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Valor Recebido</label>
                    <div className="flex items-center mt-1">
                      <span className="absolute left-4 text-gray-400 font-bold">R$</span>
                      <input 
                        ref={cashInputRef}
                        type="text" 
                        value={cashReceivedStr}
                        readOnly
                        className="w-full bg-white border-2 border-orange-200 rounded-xl py-3 pl-10 pr-4 text-right text-3xl font-bold text-gray-800 focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
                        placeholder="0,00"
                      />
                    </div>
                 </div>

                 {/* Quick Add Buttons */}
                 <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {[2, 5, 10, 20, 50, 100].map(val => (
                      <button 
                        key={val}
                        onClick={() => addBill(val)}
                        className="flex-shrink-0 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-bold py-2 px-3 rounded-lg text-sm transition-colors shadow-sm"
                      >
                        +{val}
                      </button>
                    ))}
                 </div>

                 {/* Numeric Keypad */}
                 <div className="grid grid-cols-3 gap-3 mb-6">
                    {['1','2','3','4','5','6','7','8','9','C','0',','].map(key => (
                       <button
                         key={key}
                         onClick={() => handleKeypadPress(key)}
                         className={`py-4 rounded-xl text-xl font-bold shadow-sm transition-transform active:scale-95 border
                           ${key === 'C' 
                             ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                             : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                       >
                         {key}
                       </button>
                    ))}
                 </div>

                 <button 
                   disabled={missingCash > 0}
                   onClick={handleCheckout}
                   className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all text-lg flex items-center justify-center gap-2 animate-cta-bounce active:scale-95 active:shadow-none"
                 >
                   <CheckCircle2 size={24} />
                   CONFIRMAR PAGAMENTO
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* PIX MODAL OVERLAY */}
      {showPixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 relative">
            
            {/* Close Button Absolute for cleaner look */}
            <button 
                onClick={() => { setShowPixModal(false); setSelectedMethod(null); }}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors z-10"
              >
                <X size={20} />
            </button>

            {/* Header */}
            <div className="pt-8 px-6 text-center">
              <div className="inline-flex p-3 bg-teal-50 rounded-full mb-3">
                 <QrCode size={32} className="text-teal-600" />
              </div>
              <h3 className="font-black text-xl text-gray-800 uppercase tracking-tight">
                Pagamento via Pix
              </h3>
              <p className="text-gray-500 text-sm mt-1">Aproxime a câmera ou escaneie</p>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center">
              <div className="bg-white p-2 rounded-xl border-2 border-teal-500 shadow-lg shadow-teal-100 mb-6">
                {/* IMAGEM DO QR CODE */}
                <img 
                  src={PIX_QR_IMAGE} 
                  alt="QR Code Pix"
                  className="w-64 h-64 object-contain mix-blend-multiply" 
                />
              </div>
              
              <div className="w-full text-center mb-6 bg-teal-50 p-4 rounded-xl border border-teal-100">
                <p className="text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">Valor Total</p>
                <p className="text-4xl font-black text-teal-700">{formatCurrency(total)}</p>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-200 text-lg animate-cta-bounce active:scale-95 active:shadow-sm"
              >
                <CheckCircle2 size={24} />
                CONFIRMAR PAGAMENTO
              </button>
            </div>
          </div>
        </div>
      )}

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
              onClick={() => handlePaymentSelect(PaymentMethod.CREDIT)}
            >
              <CreditCard size={20} className="mb-1" />
              Crédito
            </button>
            <button 
               className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${selectedMethod === PaymentMethod.DEBIT ? 'bg-orange-100 border-orange-500 text-orange-800 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-200'}`}
               onClick={() => handlePaymentSelect(PaymentMethod.DEBIT)}
            >
              <CreditCard size={20} className="mb-1" />
              Débito
            </button>
            <button 
               className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${selectedMethod === PaymentMethod.CASH ? 'bg-green-100 border-green-500 text-green-800 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200'}`}
               onClick={() => handlePaymentSelect(PaymentMethod.CASH)}
            >
              <Banknote size={20} className="mb-1" />
              Dinheiro
            </button>
            <button 
               className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${selectedMethod === PaymentMethod.PIX ? 'bg-teal-100 border-teal-500 text-teal-800 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-teal-50 hover:border-teal-200'}`}
               onClick={() => handlePaymentSelect(PaymentMethod.PIX)}
            >
              <QrCode size={20} className="mb-1" />
              Pix
            </button>
          </div>

          <button 
            className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transform active:scale-95 bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200`}
            disabled={!selectedMethod}
            onClick={handleCheckout}
          >
             {selectedMethod === PaymentMethod.CASH ? (
               'Calcular Troco'
             ) : selectedMethod ? (
               'Confirmar Pedido'
             ) : (
               'Selecione Pagamento'
             )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;