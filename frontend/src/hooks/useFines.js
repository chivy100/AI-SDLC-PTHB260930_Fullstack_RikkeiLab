import { useCallback, useEffect, useState } from 'react';
import { getFines } from '../services/fineService';
import { getErrorMessage } from '../utils/error';
import { DAILY_FINE_RATE } from '../utils/format';

const EMPTY_SUMMARY = {
  dailyRate: DAILY_FINE_RATE,
  collectedAmount: 0,
  unpaidSettledAmount: 0,
  provisionalAmount: 0,
  totalOwedAmount: 0,
};

export function useFines() {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    async function fetchFines() {
      setLoading(true);
      setError(null);

      try {
        const data = await getFines(controller.signal);
        if (!isCurrent) {
          return;
        }
        setSummary(data.summary || EMPTY_SUMMARY);
        setItems(data.items || []);
      } catch (err) {
        if (!isCurrent || err?.isCanceled) {
          return;
        }
        setError(
          getErrorMessage(
            err,
            'Không tải được dữ liệu quá hạn và tiền phạt. Vui lòng thử lại.'
          )
        );
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    fetchFines();

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [reloadTick]);

  const refetch = useCallback(() => {
    setReloadTick((prev) => prev + 1);
  }, []);

  return {
    summary,
    items,
    loading,
    error,
    refetch,
  };
}
