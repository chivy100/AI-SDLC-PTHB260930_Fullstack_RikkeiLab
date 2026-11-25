import { useCallback, useEffect, useState } from 'react';
import { getBorrowings } from '../services/borrowingService';
import { getEquipments } from '../services/equipmentService';
import { getErrorMessage } from '../utils/error';

const EQUIPMENT_DROPDOWN_LIMIT = 100;

export function useBorrowings() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [reloadTick, setReloadTick] = useState(0);
  const [equipmentReloadTick, setEquipmentReloadTick] = useState(0);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [equipments, setEquipments] = useState([]);
  const [equipmentsLoading, setEquipmentsLoading] = useState(true);
  const [equipmentsError, setEquipmentsError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    async function fetchBorrowings() {
      setLoading(true);
      setError(null);

      try {
        const data = await getBorrowings(statusFilter, controller.signal);
        if (!isCurrent) {
          return;
        }
        setItems(data.items || []);
      } catch (err) {
        if (!isCurrent || err?.isCanceled) {
          return;
        }
        setError(
          getErrorMessage(
            err,
            'Không tải được danh sách phiếu mượn. Vui lòng thử lại.'
          )
        );
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    fetchBorrowings();

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [statusFilter, reloadTick]);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    async function fetchEquipmentOptions() {
      setEquipmentsLoading(true);
      setEquipmentsError(null);

      try {
        const data = await getEquipments(
          { page: 1, limit: EQUIPMENT_DROPDOWN_LIMIT, category: 'all' },
          controller.signal
        );
        if (!isCurrent) {
          return;
        }
        setEquipments(data.items || []);
      } catch (err) {
        if (!isCurrent || err?.isCanceled) {
          return;
        }
        setEquipmentsError(
          getErrorMessage(
            err,
            'Không tải được danh sách thiết bị để tạo phiếu.'
          )
        );
      } finally {
        if (isCurrent) {
          setEquipmentsLoading(false);
        }
      }
    }

    fetchEquipmentOptions();

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [equipmentReloadTick]);

  const handleStatusChange = useCallback((nextStatus) => {
    setStatusFilter(nextStatus);
  }, []);

  const refetchBorrowings = useCallback(() => {
    setReloadTick((prev) => prev + 1);
  }, []);

  const refetchEquipments = useCallback(() => {
    setEquipmentReloadTick((prev) => prev + 1);
  }, []);

  const refetchAll = useCallback(() => {
    setReloadTick((prev) => prev + 1);
    setEquipmentReloadTick((prev) => prev + 1);
  }, []);

  return {
    items,
    loading,
    error,
    statusFilter,
    equipments,
    equipmentsLoading,
    equipmentsError,
    handleStatusChange,
    refetchBorrowings,
    refetchEquipments,
    refetchAll,
  };
}
