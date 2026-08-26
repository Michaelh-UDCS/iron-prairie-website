// src/operations/OperationsApp.tsx
// Main Desktop Operations & ERP Platform Shell for Iron Prairie Group LLC

import React from 'react';
import { CustomerOrder, AbandonedCartRecord, PricingConfig } from '../types';
import { ErpProvider } from '../erp/context/ErpContext';
import { ErpShell } from '../erp/ErpShell';

interface OperationsAppProps {
  orders?: CustomerOrder[];
  setOrders?: React.Dispatch<React.SetStateAction<CustomerOrder[]>>;
  abandonedCarts?: AbandonedCartRecord[];
  setAbandonedCarts?: React.Dispatch<React.SetStateAction<AbandonedCartRecord[]>>;
  pricingConfig?: PricingConfig;
  setPricingConfig?: React.Dispatch<React.SetStateAction<PricingConfig>>;
}

export const OperationsApp: React.FC<OperationsAppProps> = () => {
  return (
    <ErpProvider>
      <ErpShell />
    </ErpProvider>
  );
};
