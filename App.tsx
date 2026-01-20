import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, APP_NAME, MASCOT_URL } from './constants';
import { Product, CartItem, Transaction, PaymentMethod } from './types';
import { generateId } from './utils';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import Reports from './components/Reports';
import { LayoutGrid, BarChart3, Flame, CheckCircle2, RefreshCw, HardDrive } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'pos' | 'reports'>('pos');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Data State with LocalStorage initialization
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('pos_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [nextOrderNumber, setNextOrderNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for Order Success Modal
  const [lastCompletedOrder, setLastCompletedOrder] = useState<{number: string, change?: number} | null>(null);

  // Initialize Order Number based on today's local transactions
  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todaysOrders = transactions.filter(t => t.timestamp >= startOfDay.getTime());
    const maxOrder = todaysOrders.length > 0 
      ? Math.max(...todaysOrders.map(t => parseInt(t.orderNumber) || 0))
      : 0;
      
    setNextOrderNumber(maxOrder + 1);
  }, []); // Run once on mount

  // Save to LocalStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('pos_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // --- CART ACTIONS ---

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const handleCheckout = (discount: number, method: PaymentMethod) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = Math.max(0, subtotal - discount);
    
    const orderNumber = nextOrderNumber.toString();
    const id = generateId();

    const newTransaction: Transaction = {
      id,
      orderNumber,
      timestamp: Date.now(),
      items: [...cart],
      subtotal,
      discount,
      total,
      paymentMethod: method,
      status: 'completed'
    };

    setTransactions(prev => [...prev, newTransaction]);
    setLastCompletedOrder({ number: orderNumber });
    clearCart();
    setNextOrderNumber(prev => prev + 1);
  };

  const handleCancelTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === transactionId ? { ...t, status: 'cancelled' as const } : t
    ));
  };

  const handleResetSystem = () => {
    setTransactions([]);
    setNextOrderNumber(1);
    localStorage.removeItem('pos_transactions');
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-orange-50 relative">
      
      {/* Success Modal */}
      {lastCompletedOrder && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h2>
            <p className="text-gray-500 mb-6">Entrege a senha abaixo ao cliente.</p>
            
            <div className="bg-orange-100 border-2 border-orange-200 border-dashed rounded-xl p-6 mb-8">
              <span className="text-sm text-orange-600 font-bold uppercase tracking-wider block mb-1">SENHA</span>
              <span className="text-6xl font-black text-orange-600 tracking-tighter">
                {lastCompletedOrder.number}
              </span>
            </div>

            <button 
              onClick={() => setLastCompletedOrder(null)}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-orange-500/30"
            >
              Nova Venda
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <nav className="w-20 bg-gray-900 flex flex-col items-center py-6 gap-8 z-30 shadow-xl border-r border-gray-800 pt-10">
        <div className="text-orange-500 p-3 bg-gray-800 rounded-full mb-4 border-2 border-orange-600 shadow-lg shadow-orange-900/50">
          <Flame size={32} fill="currentColor" className="text-orange-500 animate-pulse" />
        </div>
        
        <button 
          onClick={() => setCurrentView('pos')}
          className={`p-3 rounded-xl transition-all duration-300 group ${currentView === 'pos' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          title="Caixa / Pedidos"
        >
          <LayoutGrid size={24} className={currentView === 'pos' ? "scale-110" : "group-hover:scale-110 transition-transform"} />
        </button>

        <button 
          onClick={() => setCurrentView('reports')}
          className={`p-3 rounded-xl transition-all duration-300 group ${currentView === 'reports' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          title="Relatórios de Vendas"
        >
          <BarChart3 size={24} className={currentView === 'reports' ? "scale-110" : "group-hover:scale-110 transition-transform"} />
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden pt-6">
        {currentView === 'pos' ? (
          <>
            {/* Left: Product Grid */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header Centered */}
              <header className="px-6 py-4 bg-white border-b border-orange-100 shadow-sm z-10 relative flex items-center justify-center min-h-[90px]">
                
                {/* Logo and Name Centered */}
                <div className="flex items-center gap-5 transition-transform hover:scale-105 duration-300">
                   {/* Added mix-blend-multiply and removed drop-shadow to hide white background */}
                   <img src={MASCOT_URL} className="w-20 h-20 object-contain mix-blend-multiply animate-mascot-slow" alt="Mascote" />
                   <h1 className="text-5xl font-black text-fire uppercase tracking-tighter transform -skew-x-6 drop-shadow-sm" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}>
                     {APP_NAME}
                   </h1>
                </div>

                {/* Local Storage Indicator */}
                <div className="absolute right-6 flex flex-col items-end gap-1">
                   <div className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                      <HardDrive size={12} />
                      LOCAL
                   </div>
                </div>
              </header>
              <div className="flex-1 overflow-hidden relative">
                <ProductGrid products={MOCK_PRODUCTS} onAddToCart={addToCart} />
              </div>
            </div>

            {/* Right: Cart Sidebar */}
            <div className="w-96 min-w-[350px] h-full shadow-2xl z-20">
              <CartSidebar 
                cart={cart}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateCartQuantity}
                onClearCart={clearCart}
                onCheckout={handleCheckout}
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-orange-50/50">
            <Reports 
              key={transactions.length}
              transactions={transactions} 
              onCancelTransaction={handleCancelTransaction}
              onResetSystem={handleResetSystem}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;