import { useCallback, useEffect, useState } from 'react';
import { getEquipments } from '../services/equipmentService';
import { getErrorMessage } from '../utils/error';

const DEFAULT_LIMIT = 8;

export function useEquipments() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [reloadTick, setReloadTick] = useState(0);

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === debouncedSearch) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(trimmed);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    async function fetchEquipments() {
      setLoading(true);
      setError(null);

      try {
        const data = await getEquipments(
          {
            search: debouncedSearch || undefined,
            category,
            page,
            limit: DEFAULT_LIMIT,
          },
          controller.signal
        );

        if (!isCurrent) {
          return;
        }

        setItems(data.items || []);
        setPagination(
          data.pagination || {
            page,
            limit: DEFAULT_LIMIT,
            totalItems: 0,
            totalPages: 0,
          }
        );
      } catch (err) {
        if (!isCurrent || err?.isCanceled) {
          return;
        }
        setError(
          getErrorMessage(
            err,
            'Không tải được danh sách thiết bị. Vui lòng thử lại.'
          )
        );
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    fetchEquipments();

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [debouncedSearch, category, page, reloadTick]);

  const handleSearchChange = useCallback((nextValue) => {
    setSearchInput(nextValue);
  }, []);

  const handleCategoryChange = useCallback((nextCategory) => {
    setCategory(nextCategory);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setCategory('all');
    setPage(1);
  }, []);

  const refetch = useCallback(() => {
    setReloadTick((prev) => prev + 1);
  }, []);

  const refreshAfterDelete = useCallback(() => {
    if (items.length <= 1 && page > 1) {
      setPage((prev) => Math.max(1, prev - 1));
    } else {
      setReloadTick((prev) => prev + 1);
    }
  }, [items.length, page]);

  return {
    items,
    pagination,
    loading,
    error,
    searchInput,
    debouncedSearch,
    category,
    page,
    setPage,
    handleSearchChange,
    handleCategoryChange,
    resetFilters,
    refetch,
    refreshAfterDelete,
  };
}
