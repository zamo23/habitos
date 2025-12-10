import { Heart, TrendingUp, Users, X, Shield, Smartphone, Sparkles, Gift } from 'lucide-react';

const styles = `
  .neon-card {
    transition: all 0.3s ease;
  }
  
  .neon-card:hover {
    box-shadow: 0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor !important;
  }

  .neon-icon {
    filter: brightness(1.3) saturate(1.2);
    transition: all 0.3s ease;
  }

  .neon-card:hover .neon-icon {
    filter: brightness(1.6) saturate(1.4);
  }
`;

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Todo lo que necesitas para cambiar tus hábitos
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Herramientas poderosas y simples para construir hábitos positivos y eliminar los negativos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Heart className="w-6 h-6 text-green-600 dark:text-green-400" />}
            title="Hábitos Positivos"
            description="Crea y mantén hábitos saludables como hacer ejercicio, leer, meditar o cualquier actividad que mejore tu bienestar."
            bgColor="bg-green-100 dark:bg-green-900/30"
            glowColor="rgba(34, 197, 94, 0.3)"
            borderColor="#22c55e"
          />

          <FeatureCard
            icon={<X className="w-6 h-6 text-red-600 dark:text-red-400" />}
            title="Eliminar Hábitos Negativos"
            description="Rompe con patrones destructivos y adicciones. Nuestra app te ayuda a identificar y eliminar hábitos que te limitan."
            bgColor="bg-red-100 dark:bg-red-900/30"
            glowColor="rgba(239, 68, 68, 0.3)"
            borderColor="#ef4444"
          />

          <FeatureCard
            icon={<TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            title="Sistema de Rachas"
            description="Mantente activo con nuestro sistema de rachas que aumenta día a día. Cada día completado suma a tu racha, motivándote a seguir adelante."
            bgColor="bg-blue-100 dark:bg-blue-900/30"
            glowColor="rgba(59, 130, 246, 0.3)"
            borderColor="#3b82f6"
          />

          <FeatureCard
            icon={<Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
            title="Hábitos Grupales"
            description="Conecta con amigos y familiares. Los hábitos grupales te permiten motivarte mutuamente y alcanzar metas juntos."
            bgColor="bg-purple-100 dark:bg-purple-900/30"
            glowColor="rgba(147, 51, 234, 0.3)"
            borderColor="#9333ea"
            badge="Solo Premium"
          />

          <FeatureCard
            icon={<Smartphone className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
            title="Multiplataforma"
            description="Accede desde cualquier dispositivo. Sincronización automática entre tu teléfono, tablet y computadora."
            bgColor="bg-yellow-100 dark:bg-yellow-900/30"
            glowColor="rgba(202, 138, 4, 0.3)"
            borderColor="#ca8a04"
          />

          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />}
            title="Consejos con IA"
            description="Recibe recomendaciones personalizadas basadas en inteligencia artificial. Consejos adaptativos que mejoran con tu progreso."
            bgColor="bg-cyan-100 dark:bg-cyan-900/30"
            glowColor="rgba(34, 211, 238, 0.3)"
            borderColor="#22d3ee"
          />

          <FeatureCard
            icon={<Gift className="w-6 h-6 text-pink-600 dark:text-pink-400" />}
            title="Gratis y sin Anuncios"
            description="Acceso completo a todas las características sin costo. Disfruta de una experiencia limpia sin interrupciones ni publicidad invasiva."
            bgColor="bg-pink-100 dark:bg-pink-900/30"
            glowColor="rgba(236, 72, 153, 0.3)"
            borderColor="#ec4899"
          />

          <FeatureCard
            icon={<Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
            title="Privacidad Garantizada"
            description="Tus datos están seguros. Encriptación end-to-end y políticas estrictas de privacidad para proteger tu información personal."
            bgColor="bg-indigo-100 dark:bg-indigo-900/30"
            glowColor="rgba(79, 70, 229, 0.3)"
            borderColor="#4f46e5"
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  glowColor: string;
  borderColor: string;
  badge?: string;
}

const FeatureCard = ({ icon, title, description, bgColor, borderColor, badge }: FeatureCardProps) => {
  return (
    <div className="neon-card bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 transition-all" style={{
      border: `2px solid ${borderColor}`,
      boxShadow: `0 0 10px ${borderColor}40`
    }}>
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-6`}>
        <span className="neon-icon">
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
      {badge && (
        <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full mt-2">
          {badge}
        </span>
      )}
    </div>
  );
};
