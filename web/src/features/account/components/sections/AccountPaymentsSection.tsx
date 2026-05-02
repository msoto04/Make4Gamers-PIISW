import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star, Zap, CreditCard, Loader2, AlertCircle, RefreshCw, Save } from 'lucide-react';
import { updateAccountProfile } from '../../services/account.service';

interface AccountPaymentsSectionProps {
  userId: string;
  currentTier: string;
  onUpgradeSuccess: () => void;
}

export function AccountPaymentsSection({ userId, currentTier, onUpgradeSuccess }: AccountPaymentsSectionProps) {
  const { t } = useTranslation(); // <--- Añade esto
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);

  const isPremium = currentTier === 'premium';

  // Función para SUBIR a Premium
  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await updateAccountProfile(userId, { subscription_tier: 'premium' } as any);
      setShowSuccess(true);
      setTimeout(() => onUpgradeSuccess(), 2000);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el pago.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para volver al Plan Básico
  const handleDowngrade = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await updateAccountProfile(userId, { subscription_tier: 'free' } as any);
      setShowDowngradeConfirm(false);
      onUpgradeSuccess(); // Recarga para ver los cambios
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cambiar de plan.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-slate-800 rounded-xl border border-green-500/50 p-12 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <Check size={40} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">¡Pago Completado!</h2>
        <p className="text-slate-300 text-lg">Bienvenido al club <span className="text-yellow-400 font-bold">Next</span>.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* MODAL DE ADVERTENCIA PARA DOWNGRADE */}
      {showDowngradeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <AlertCircle size={28} />
              <h3 className="text-xl font-bold text-white">¿Cambiar al Plan Retro?</h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Al volver al plan gratuito, perderás tus ventajas. <br /><br />
              <span className="bg-amber-400/10 text-amber-400 px-2 py-1 rounded font-medium">
                Si cancelas ahora perderas los dias restantes de suscripcion
              </span>
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDowngradeConfirm(false)}
                className="flex-1 py-3 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors">
                Mantener Premium
              </button>
              <button 
                onClick={handleDowngrade}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-500 transition-colors flex items-center justify-center gap-2">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Planes y Facturación</h2>
        <p className="text-slate-400">Gestiona tu suscripción y descubre las ventajas exclusivas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* PLAN GRATUITO */}
        <div className={`bg-slate-800/50 rounded-2xl border ${!isPremium ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-700'} p-6 flex flex-col relative`}>
          {!isPremium && <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">PLAN ACTUAL</div>}
          <h3 className="text-xl font-bold text-white mb-2">Plan Retro</h3>
          <p className="text-slate-400 mb-6 flex-1 text-sm">Funciones esenciales para jugar.</p>
          <div className="text-3xl font-bold text-white mb-6">Gratis</div>
          
          <ul className="space-y-3 mb-8 text-slate-300 text-sm">
            <li className="flex items-center gap-2"><Check size={16} className="text-indigo-400"/> Catálogo de juegos limitado</li>
            <li className="flex items-center gap-2"><Check size={16} className="text-indigo-400"/> Chats con amigos</li>
          </ul>

          {isPremium ? (
            <button 
              onClick={() => setShowDowngradeConfirm(true)}
              className="w-full py-3 rounded-lg font-bold border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
              <RefreshCw size={18} /> Volver al Plan Retro
            </button>
          ) : (
            <button disabled className="w-full py-3 rounded-lg font-bold bg-slate-700 text-slate-400 cursor-not-allowed">Tu Plan Actual</button>
          )}
        </div>

        {/* PLAN PREMIUM */}
        <div className={`bg-slate-900 rounded-2xl border ${isPremium ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-slate-700'} p-6 flex flex-col relative overflow-hidden`}>
          {isPremium && <div className="absolute top-0 right-0 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg">ACTIVO</div>}
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Zap size={24} className="text-yellow-400" />
            <h3 className="text-xl font-bold text-yellow-400">Plan Next</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-6 relative z-10">4,99€ <span className="text-sm text-slate-400 font-normal">/mes</span></div>
          
          <ul className="space-y-3 mb-8 text-slate-300 relative z-10 text-sm">
            <li className="flex items-center gap-2 font-medium text-white">
              <Check size={16} className="text-yellow-400"/> Acceso a juegos exclusivos
            </li>
            
            <li className="flex items-center gap-2 font-medium text-white">
              <Check size={16} className="text-yellow-400"/> 
              Insignia dorada en el perfil 
              <Save size={14} className="text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            </li>
            
            <li className="flex items-center gap-2 font-medium text-white">
              <Check size={16} className="text-yellow-400"/> Mayor puntuacion en juegos seleccionados
            </li>
            <li className="flex items-center gap-2 font-medium text-white">
              <Check size={16} className="text-yellow-400"/> Cancelar cuando quieras
            </li>
          </ul>

          {!isPremium ? (
            <button 
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 hover:from-yellow-400 transition-all flex items-center justify-center gap-2 relative z-10 shadow-lg shadow-yellow-500/20 disabled:opacity-70">
              {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <><CreditCard size={20} /> Ser Premium</>}
            </button>
          ) : (
            <div className="w-full py-3 text-center font-bold text-yellow-500 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              Suscripción Activa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}