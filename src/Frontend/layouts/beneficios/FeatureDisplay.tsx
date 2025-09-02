import React from "react";
import { Check } from "lucide-react";

export interface Feature {
  text: string;
  badge?: string;
}

interface FeatureDisplayProps {
  feature: string | Feature;
  textColor?: string;
  checkColor?: string;
}

export const FeatureDisplay: React.FC<FeatureDisplayProps> = ({ 
  feature, 
  textColor = "text-gray-300",
  checkColor = "text-blue-400"
}) => {
  const isString = typeof feature === "string";
  const text = isString ? feature : feature.text;
  const badge = !isString ? feature.badge : undefined;

  return (
    <div className="flex items-center gap-2">
      <Check className={`h-4 w-4 shrink-0 ${checkColor}`} />
      <span className={textColor}>
        {text}
        {badge && (
          <span className="ml-2 inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400 ring-1 ring-white/10">
            {badge}
          </span>
        )}
      </span>
    </div>
  );
};
