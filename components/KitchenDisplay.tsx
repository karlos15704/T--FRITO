import React, { useState, useEffect, useMemo } from 'react';
import { Transaction } from '../types';
import { Clock, CheckCircle2, ChefHat, PackageCheck, History, RotateCcw } from 'lucide-react';

interface KitchenDisplayProps {
  transactions: Transaction[];
}

type ViewMode = 'active' | 'history';

const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ transactions }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  
  // Local state to track which orders are "done" in the kitchen without affecting the financial status
  const [completedKitchenIds, setCompletedKitchenIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('kitchen_completed_ids');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kitchen_completed_ids', JSON.stringify(completedKitchenIds));
  }, [completedKitchenIds]);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Filter for active orders (Pendentes)
  const pendingOrders = useMemo(() => {
    return transactions
      .filter(t => 
        t.status === 'completed' && 
        t.timestamp >= startOfDay.getTime() &&
        !completedKitchenIds.includes(t.id)
      )
      .sort((a, b) => a.timestamp - b.timestamp); // FIFO: Oldest first
  }, [transactions, completedKitchenIds]);

  // Filter for completed orders (Histórico do dia)
  const historyOrders = useMemo(() => {
    return transactions
      .filter(t => 
        t.status === 'completed' && 
        t.timestamp >= startOfDay.getTime() &&
        completedKitchenIds.includes(t.id)
      )
      .sort((a, b) => b.timestamp - a.timestamp); // LIFO: Newest finished first
  }, [transactions, completedKitchenIds]);

  const handleMarkAsDone = (id: string) => {
    setCompletedKitchenIds(prev => [...prev, id]);
  };

  const handleReturnToPrep = (id: string) => {
    setCompletedKitchenIds(prev => prev.filter(completedId => completedId !== id));
  };

  const currentList = viewMode === 'active' ? pendingOrders : historyOrders;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md flex flex-col md:flex-row justify-between items-center gap-4 z-10">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 hidden md:block">
             <ChefHat size={24} className="text-orange-500" />
          </div>
          <div>
             <h2 className="text-xl font-bold tracking-wide">COZINHA</h2>
             <p className="text-xs text-slate-400 hidden md:block">Gestão de Pedidos</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex p-1 bg-slate-800 rounded-lg border border-slate-700 w-full md:w-auto">
          <button
            onClick={() => setViewMode('active')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
              viewMode === 'active' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <PackageCheck size={18} />
            PENDENTES ({pendingOrders.length})
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
              viewMode === 'history' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <History size={18} />
            PRONTOS ({historyOrders.length})
          </button>
        </div>

        <div className="hidden md:block text-right min-w-[120px]">
          <div className="text-2xl font-bold font-mono leading-none">
            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
          <div className="text-xs text-slate-400">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
        {currentList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
             {viewMode === 'active' ? (
                <>
                  <ChefHat size={80} strokeWidth={1} className="mb-4" />
                  <p className="text-2xl font-light">Tudo limpo!</p>
                  <p className="text-sm">Sem pedidos pendentes no momento.</p>
                </>
             ) : (
                <>
                  <History size={80} strokeWidth={1} className="mb-4" />
                  <p className="text-2xl font-light">Sem histórico</p>
                  <p className="text-sm">Nenhum pedido foi concluído hoje ainda.</p>
                </>
             )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {currentList.map((order) => {
               // Calculate elapsed time (simple version)
               const timeDate = new Date(order.timestamp);
               const timeString = timeDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
               
               const isHistory = viewMode === 'history';

               return (
                 <div key={order.id} className={`bg-white rounded-xl shadow-sm border-l-4 border-y border-r flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 ${isHistory ? 'border-l-blue-400 border-gray-200 opacity-90' : 'border-l-orange-500 border-gray-200'}`}>
                    {/* Card Header */}
                    <div className={`p-3 border-b flex justify-between items-start ${isHistory ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
                       <div>
                          <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${isHistory ? 'text-blue-600' : 'text-orange-600'}`}>Senha</span>
                          <span className="text-4xl font-black text-slate-800 leading-none">#{order.orderNumber}</span>
                       </div>
                       <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm font-bold text-gray-700">{timeString}</span>
                       </div>
                    </div>

                    {/* Items List */}
                    <div className="p-4 flex-1 overflow-y-auto max-h-[300px]">
                       <ul className="space-y-3">
                          {order.items.map((item, idx) => (
                             <li key={`${order.id}-${idx}`} className="flex items-start gap-3">
                                <div className={`min-w-[24px] h-6 flex items-center justify-center font-bold text-sm rounded border ${isHistory ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                   {item.quantity}
                                </div>
                                <span className={`font-medium leading-tight pt-0.5 ${isHistory ? 'text-gray-500 line-through' : 'text-slate-700'}`}>
                                   {item.name}
                                </span>
                             </li>
                          ))}
                       </ul>
                    </div>

                    {/* Action Footer */}
                    <div className="p-3 bg-gray-50 border-t border-gray-100">
                       {isHistory ? (
                         <button 
                            onClick={() => handleReturnToPrep(order.id)}
                            className="w-full bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 hover:border-orange-300 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm group"
                         >
                            <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
                            VOLTAR PARA PREPARO
                         </button>
                       ) : (
                         <button 
                            onClick={() => handleMarkAsDone(order.id)}
                            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                         >
                            <CheckCircle2 size={20} />
                            PRONTO
                         </button>
                       )}
                    </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;