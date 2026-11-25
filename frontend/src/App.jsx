import { useState } from 'react';
import AppShell from './components/common/AppShell';
import BackendStatus from './components/common/BackendStatus';
import BorrowingPage from './pages/BorrowingPage';
import EquipmentPage from './pages/EquipmentPage';
import FinePage from './pages/FinePage';

function App() {
  const [activeTab, setActiveTab] = useState('equipments');

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      statusSlot={<BackendStatus />}
    >
      {activeTab === 'equipments' && <EquipmentPage />}
      {activeTab === 'borrowings' && <BorrowingPage />}
      {activeTab === 'fines' && <FinePage />}
    </AppShell>
  );
}

export default App;
