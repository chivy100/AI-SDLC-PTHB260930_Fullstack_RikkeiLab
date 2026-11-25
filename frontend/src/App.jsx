import { useState } from 'react';
import AppShell from './components/common/AppShell';
import BackendStatus from './components/common/BackendStatus';
import EquipmentPage from './pages/EquipmentPage';

const TAB_PLACEHOLDERS = {
  borrowings: {
    title: 'Phiếu mượn thiết bị',
    description:
      'Khung nền tảng màn hình Phiếu mượn thiết bị (Bước 5.4 sẽ tích hợp tạo phiếu mượn, lọc trạng thái và trả thiết bị qua API).',
  },
  fines: {
    title: 'Quá hạn và tiền phạt',
    description:
      'Khung nền tảng màn hình Quá hạn và tiền phạt (Bước 5.5 sẽ tích hợp tổng hợp tiền phạt và xác nhận thu tiền phạt qua API).',
  },
};

function App() {
  const [activeTab, setActiveTab] = useState('equipments');

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      statusSlot={<BackendStatus />}
    >
      {activeTab === 'equipments' ? (
        <EquipmentPage />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h4 mb-0">{TAB_PLACEHOLDERS[activeTab].title}</h1>
          </div>
          <div className="card">
            <div className="card-body">
              <p className="text-muted mb-0">
                {TAB_PLACEHOLDERS[activeTab].description}
              </p>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

export default App;
