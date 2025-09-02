interface PricingCardProps {
    title: string;
    price: number;
    isAnnual: boolean;
    description: string;
    features: string[];
    isPopular?: boolean;
    onSubscribe: () => void;
}

export const PricingCard = ({
    title,
    price,
    isAnnual,
    description,
    features,
    isPopular,
    onSubscribe
}: PricingCardProps) => {
    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 ${isPopular ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
            } hover:shadow-lg transition-shadow relative`}>
            {isPopular && (
                <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Más Popular
                </span>
            )}

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
            <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">S/.{price}</span>
                <span className="text-gray-500 dark:text-gray-400">/{isAnnual ? 'año' : 'mes'}</span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>

            <button
                onClick={onSubscribe}
                className={`w-full py-3 px-4 rounded-lg transition-colors font-semibold mb-6 ${isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
            >
                Comenzar {title}
            </button>

            <ul className="space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg
                            className="w-5 h-5 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
};
