import { useContext } from 'react';
import { SubscriptionContext } from '../layouts/state/SubscriptionContext';

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription debe ser usado dentro de SubscriptionProvider');
    }
    return context;
}
