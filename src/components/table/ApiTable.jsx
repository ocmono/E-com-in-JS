import { useState, useEffect, useCallback } from "react";
import Table from "./Table.jsx";

/**
 * ApiTable - Table with server-side pagination (limit, offset, page).
 * Fetches data directly from API when page or limit changes.
 *
 * @param {Object} props
 * @param {Function} props.fetchData - async ({ page, limit, offset }) => ({ data, total })
 * @param {Array} props.columns - Same as Table
 * @param {string} props.rowKey - Same as Table
 * @param {ReactNode} props.filterBar - Same as Table
 * @param {Object} props.emptyState - Same as Table
 * @param {string} props.dataKey - Key in response for data array (default: 'data')
 * @param {string} props.totalKey - Key in response for total count (default: 'total')
 * @param {Array} props.perPageOptions - [10, 25, 50, 100]
 * @param {number} props.initialPage - Default 1
 * @param {number} props.initialLimit - Default 10
 * @param {Function} props.onParamsChange - (page, limit) => when params change (e.g. for URL sync)
 */
export default function ApiTable({
  fetchData,
  columns = [],
  rowKey = "id",
  filterBar,
  emptyState = {},
  dataKey = "data",
  totalKey = "total",
  perPageOptions = [10, 25, 50, 100],
  initialPage = 1,
  initialLimit = 10,
  onParamsChange,
  selectable = false,
}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (pageNum, limitNum) => {
      if (!fetchData) return;
      setLoading(true);
      setError(null);
      try {
        const offset = (pageNum - 1) * limitNum;
        const res = await fetchData({ page: pageNum, limit: limitNum, offset });
        const items = res[dataKey] ?? res.data ?? res.items ?? res.results ?? [];
        const count = res[totalKey] ?? res.total ?? res.count ?? 0;
        setData(Array.isArray(items) ? items : []);
        setTotal(Number(count) || 0);
      } catch (err) {
        setError(err.message || "Failed to load data");
        setData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [fetchData, dataKey, totalKey]
  );

  useEffect(() => {
    load(page, limit);
  }, [page, limit, load]);

  useEffect(() => {
    onParamsChange?.(page, limit);
  }, [page, limit, onParamsChange]);

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, newPage));
  };

  const handlePerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (loading && data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500" style={{ borderColor: "var(--table-border)" }}>
        Loading…
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-red-600" style={{ borderColor: "var(--table-border)" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={rowKey}
      selectable={selectable}
      filterBar={filterBar}
      emptyState={emptyState}
      perPageOptions={perPageOptions}
      pagination={{
        page,
        perPage: limit,
        total,
        onPageChange: handlePageChange,
        onPerPageChange: handlePerPageChange,
      }}
    />
  );
}
