import { Switch } from '@headlessui/react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  labelLeft: string;
  labelRight: string;
  discount?: number;
}

export const ToggleSwitch = ({ enabled, onChange, labelLeft, labelRight, discount }: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-center">
      <span className={`text-sm font-medium mr-3 ${!enabled ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
        {labelLeft}
      </span>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
      >
        <span className="sr-only">Enable {labelRight}</span>
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      <span className={`text-sm font-medium ml-3 ${enabled ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
        {labelRight}
        {discount && enabled && (
          <span className="text-green-600 dark:text-green-400 ml-1">
            ({discount}% descuento)
          </span>
        )}
      </span>
    </div>
  );
};
