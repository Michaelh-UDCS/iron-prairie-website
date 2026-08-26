// src/App.tsx - IPG Custom ERP Standalone Entry Point
import React from 'react';
import { ErpProvider } from './erp/context/ErpContext';
import { ErpShell } from './erp/ErpShell';

export default function App() {
  return (
    <ErpProvider>
      <ErpShell />
    </ErpProvider>
  );
}
