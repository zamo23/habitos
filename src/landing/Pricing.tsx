import { ToggleSwitch } from './components/ToggleSwitch';
import { PricingCard } from './components/PricingCard';

interface PricingProps {
  isAnnual: boolean;
  onPeriodChange: (isAnnual: boolean) => void;
}

const getPricing = (isAnnual: boolean) => {
  const monthly = { free: 0, standard: 3, premium: 5 };
  const annual = { free: 0, standard: 30, premium: 50 }; // 2 months free
  return isAnnual ? annual : monthly;
};

const getDiscountPercentage = (plan: 'standard' | 'premium') => {
  const monthly = plan === 'standard' ? 3 : 5;
  const annual = plan === 'standard' ? 30 : 50;
  const monthlyEquivalent = monthly * 12;
  return Math.round(((monthlyEquivalent - annual) / monthlyEquivalent) * 100);
};

export const Pricing = ({ isAnnual, onPeriodChange }: PricingProps) => {
  const pricing = getPricing(isAnnual);

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Planes que se adaptan a ti
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comienza gratis y escala según tus necesidades. Todos los planes incluyen soporte completo.
          </p>

          <div className="mt-8 mb-8">
            <ToggleSwitch
              enabled={isAnnual}
              onChange={onPeriodChange}
              labelLeft="Mensual"
              labelRight="Anual"
              discount={getDiscountPercentage('premium')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Free"
            price={pricing.free}
            isAnnual={isAnnual}
            description="Para individuos que quieren empezar su viaje de transformación"
            features={[
              "Seguimiento de 3 hábitos",
              "Estadísticas básicas",
              "Recordatorios diarios",
              "Soporte por email"
            ]}
            onSubscribe={() => { }}
          />

          <PricingCard
            title="Standard"
            price={pricing.standard}
            isAnnual={isAnnual}
            description="Para usuarios que quieren llevar sus hábitos al siguiente nivel"
            features={[
              "Seguimiento de hasta 10 hábitos",
              "Estadísticas avanzadas",
              "Recordatorios personalizados (Próximamente)",
              "Soporte prioritario",
              "Exportación de datos (Próximamente)"
            ]}
            onSubscribe={() => { }}
          />

          <PricingCard
            title="Premium"
            price={pricing.premium}
            isAnnual={isAnnual}
            description="Para equipos y familias que quieren transformarse juntos"
            features={[
              "Seguimiento ilimitado de hábitos",
              "Todo lo de Standard",
              "Hábitos grupales (Próximamente)",
              "Panel de administración (Próximamente)",
              "Soporte 24/7",
              "Coaching mensual (Próximamente)"
            ]}
            isPopular
            onSubscribe={() => { }}
          />
        </div>

        {/* Métodos de pago */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Métodos de Pago Disponibles
          </h3>
          <div className="flex justify-center items-center space-x-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">Y</span>
              </div>
              <span>Yape</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">T</span>
              </div>
              <span>Transferencias</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">P</span>
              </div>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
