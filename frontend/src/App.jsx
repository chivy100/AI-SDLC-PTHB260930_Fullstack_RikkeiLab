import { useState } from 'react';
import AppShell from './components/common/AppShell';
import BackendStatus from './components/common/BackendStatus';
import BorrowingPage from './pages/BorrowingPage';
import EquipmentPage from './pages/EquipmentPage';

const FINES_PLACEHOLDER = {
  title: 'Quá hạn và tiền phạt',
  description:
    'Khung nền tảng màn hình Quá hạn và tiền phạt (Bước 5.5 sẽ tích hợp tổng hợp tiền phạt và xác nhận thu tiền phạt qua API).',
};

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
      {activeTab === 'fines' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h4 mb-0">{FINES_PLACEHOLDER.title}</h1>
          </div>
          <div className="card">
            <div className="card-body">
              <p className="text-muted mb-0">
                {FINES_PLACEHOLDER.description}
              </p>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

export default App;
