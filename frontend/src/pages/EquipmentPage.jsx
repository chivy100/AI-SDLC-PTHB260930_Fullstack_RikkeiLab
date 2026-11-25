import { useState } from 'react';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import Pagination from '../components/common/Pagination';
import StatusAlert from '../components/common/StatusAlert';
import ConfirmDeleteModal from '../components/equipments/ConfirmDeleteModal';
import EquipmentDetailModal from '../components/equipments/EquipmentDetailModal';
import EquipmentFormModal from '../components/equipments/EquipmentFormModal';
import EquipmentTable from '../components/equipments/EquipmentTable';
import EquipmentToolbar from '../components/equipments/EquipmentToolbar';
import { useEquipments } from '../hooks/useEquipments';

function EquipmentPage() {
  const {
    items,
    pagination,
    loading,
    error,
    searchInput,
    debouncedSearch,
    category,
    setPage,
    handleSearchChange,
    handleCategoryChange,
    resetFilters,
    refetch,
    refreshAfterDelete,
  } = useEquipments();

  const [successMessage, setSuccessMessage] = useState('');
  const [detailId, setDetailId] = useState(null);
  const [formModal, setFormModal] = useState({
    isOpen: false,
    mode: 'create',
    equipment: null,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const hasActiveFilter = Boolean(debouncedSearch) || category !== 'all';

  const openCreateModal = () => {
    setFormModal({ isOpen: true, mode: 'create', equipment: null });
  };

  const openEditModal = (equipment) => {
    setFormModal({ isOpen: true, mode: 'edit', equipment });
  };

  const closeFormModal = () => {
    setFormModal({ isOpen: false, mode: 'create', equipment: null });
  };

  const handleFormSuccess = (message) => {
    closeFormModal();
    setSuccessMessage(message);
    refetch();
  };

  const handleDeleted = (deletedItem) => {
    setDeleteTarget(null);
    setSuccessMessage(
      `Đã xóa thiết bị ${deletedItem.name} (${deletedItem.code}).`
    );
    refreshAfterDelete();
  };

  return (
    <section aria-label="Quản lý thiết bị">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">Quản lý thiết bị</h1>
      </div>

      <StatusAlert
        variant="success"
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />

      <EquipmentToolbar
        search={searchInput}
        category={category}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onAddClick={openCreateModal}
      />

      {loading && <LoadingState message="Đang tải dữ liệu..." />}

      {!loading && error && (
        <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2 mb-0" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={refetch}
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div>
          <EmptyState
            message={
              hasActiveFilter
                ? 'Không tìm thấy thiết bị nào phù hợp.'
                : 'Chưa có thiết bị nào trong hệ thống.'
            }
          />
          {hasActiveFilter && (
            <div className="text-center mt-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={resetFilters}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <EquipmentTable
            items={items}
            onViewDetail={(item) => setDetailId(item.id)}
            onEdit={openEditModal}
            onDelete={(item) => setDeleteTarget(item)}
          />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemLabel="thiết bị"
            onPageChange={setPage}
          />
        </>
      )}

      <EquipmentDetailModal
        equipmentId={detailId}
        onClose={() => setDetailId(null)}
      />

      <EquipmentFormModal
        isOpen={formModal.isOpen}
        mode={formModal.mode}
        initialEquipment={formModal.equipment}
        onClose={closeFormModal}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDeleteModal
        equipment={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </section>
  );
}

export default EquipmentPage;
