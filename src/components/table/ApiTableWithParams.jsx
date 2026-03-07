import { useState, useEffect, useCallback } from "react";
import Table, {
  TableFilterBarWithSearch,
  TableSearchInput,
  TableSelect,
} from "./Table.jsx";

/**
 * ApiTableWithParams - Table with server-side pagination, search, and filters.
 * All params (limit, offset, page, search, filters) are sent to the API.
 *
 * @param {Function} props.fetchData - async (params) => ({ data, total })
 *   params: { page, limit, offset, search, filters: { [paramKey]: value } }
 * @param {Array} props.columns - Same as Table
 * @param {Object} props.search - { paramKey, label, placeholder }
 * @param {Array} props.filters - [{ key, paramKey, label, options, placeholder }]
 * @param {Object} props.emptyState - Same as Table
 * @param {string} props.dataKey - Response key for data array
 * @param {string} props.totalKey - Response key for total count
 * @param {Array} props.perPageOptions - [10, 25, 50, 100]
 */
export default function ApiTableWithParams({
  fetchData,
  columns = [],
  rowKey = "id",
  search = {},
  filters = [],
  emptyState = {},
  dataKey = "data",
  totalKey = "total",
  perPageOptions = [10, 25, 50, 100],
  initialPage = 1,
  initialLimit = 10,
  selectable = false,
}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState(() => {
    const init = {};
    filters.forEach((f) => {
      init[f.paramKey ?? f.key] = "";
    });
    return init;
  });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParamKey = search.paramKey ?? "q";
  const searchLabel = search.label ?? "Search";
  const searchPlaceholder = search.placeholder ?? "Search...";

  const load = useCallback(
    async (pageNum, limitNum, searchVal, filtersObj) => {
      if (!fetchData) return;
      setLoading(true);
      setError(null);
      try {
        const offset = (pageNum - 1) * limitNum;
        const filtersToSend = {};
        Object.entries(filtersObj).forEach(([k, v]) => {
          if (v != null && v !== "" && v !== "all") filtersToSend[k] = v;
        });
        const params = {
          page: pageNum,
          limit: limitNum,
          offset,
          search: searchVal?.trim() || undefined,
          filters: filtersToSend,
        };
        const res = await fetchData(params);
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
    load(page, limit, searchQuery, filterValues);
  }, [page, limit, searchQuery, filterValues, load]);

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, newPage));
  };

  const handlePerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleFilterChange = (paramKey, val) => {
    setFilterValues((prev) => ({ ...prev, [paramKey]: val }));
    setPage(1);
  };

  const filterBar =
    (search.paramKey !== false || filters.length > 0) ? (
      <TableFilterBarWithSearch
        search={
          search.paramKey !== false ? (
            <TableSearchInput
              label={searchLabel}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          ) : null
        }
      >
        {filters.map((f) => (
          <TableSelect
            key={f.key ?? f.paramKey}
            label={f.label}
            value={filterValues[f.paramKey ?? f.key] ?? ""}
            onChange={(val) => handleFilterChange(f.paramKey ?? f.key, val)}
            options={f.options ?? []}
            placeholder={f.placeholder}
          />
        ))}
      </TableFilterBarWithSearch>
    ) : null;

  if (loading && data.length === 0) {
    return (
      <div
        className="rounded-lg border bg-white p-8 text-center text-gray-500"
        style={{ borderColor: "var(--table-border)" }}
      >
        Loading…
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div
        className="rounded-lg border bg-white p-8 text-center text-red-600"
        style={{ borderColor: "var(--table-border)" }}
      >
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
