import React, { memo, useState, useRef, useEffect } from "react";

/* -------------------------------- */
/* Icons */
/* -------------------------------- */

const Icon = ({ children, className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {children}
  </svg>
);

const FilterIcon = memo(() => (
  <Icon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </Icon>
));

const ExportIcon = memo(() => (
  <Icon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </Icon>
));

const DownloadIcon = memo(() => (
  <Icon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </Icon>
));

const ChevronDownIcon = memo(() => (
  <Icon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </Icon>
));

const SearchIcon = memo(() => (
  <Icon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </Icon>
));

const EmptyBoxIcon = memo(() => (
  <svg className="w-16 h-16" fill="none" stroke="var(--table-placeholder)" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
));

/* -------------------------------- */
/* Styles */
/* -------------------------------- */

const headerStyle = {
  color: "var(--table-text-muted)",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const renderValue = (value) => {
  if (value == null) return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

/* -------------------------------- */
/* Table Component */
/* -------------------------------- */

function Table({
  columns = [],
  data = [],
  selectable = false,
  filterBar,
  emptyState = {},
  pagination,
  perPageOptions = [10, 25, 50, 100],
  rowKey = "id",
}) {

  const {
    message = "No items found",
    subMessage = "Try adjusting your filters or add a new item to get started.",
    actionLabel,
    onAction,
  } = emptyState;

  const isEmpty = data.length === 0;

  let start = 1;
  let end = data.length;
  let total = data.length;
  let totalPages = 1;

  if (pagination) {
    total = pagination.total;
    totalPages = Math.max(1, Math.ceil(total / pagination.perPage));
    start = total === 0 ? 0 : (pagination.page - 1) * pagination.perPage + 1;
    end = total === 0 ? 0 : Math.min(pagination.page * pagination.perPage, total);
  }

  return (
    <div className="rounded-lg overflow-hidden border bg-white" style={{ borderColor: "var(--table-border)" }}>

      {filterBar && <div className="p-4">{filterBar}</div>}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* HEADER */}

          <thead style={{ borderBlock: "1px solid var(--table-border)" }}>

            <tr style={{ background: "var(--admin-canvas-bg)" }}>

              {selectable && (
                <th className="px-4 py-3 text-center" style={headerStyle}>
                  <input type="checkbox" />
                </th>
              )}

              {columns.map((col) => (
                <th key={col.key} className="px-4 py-2" style={{ ...headerStyle, textAlign: col.align || "center" }}>
                  {col.label}
                </th>
              ))}

            </tr>

          </thead>

          {/* BODY */}

          <tbody>

            {isEmpty ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">

                    <EmptyBoxIcon />

                    <p className="text-base text-gray-500">{message}</p>
                    <p className="text-sm text-gray-400">{subMessage}</p>

                    {actionLabel && onAction && (
                      <button onClick={onAction}
                        className="px-4 py-2 text-white rounded-md"
                        style={{ background: "var(--table-primary)" }}>
                        + {actionLabel}
                      </button>
                    )}

                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (

                <tr key={row[rowKey] ?? i}
                  className="hover:bg-neutral-50"
                  style={{ borderBottom: "1px solid var(--table-border)" }}>

                  {selectable && (
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" />
                    </td>
                  )}

                  {columns.map((col) => (
                    <td key={col.key}
                      className="px-4 py-3 text-sm"
                      style={{ textAlign: col.align || "center", color: "var(--table-text)" }}>

                      {col.render
                        ? col.render(row[col.key], row)
                        : renderValue(row[col.key])}

                    </td>
                  ))}

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      {pagination && (

        <div
          className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 "
          style={{ background: "var(--admin-canvas-bg)", borderColor: "var(--table-border)" }}
        >

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Showing {start}-{end} of {total}</span>
            <select
              value={pagination.perPage}
              onChange={(e) => pagination.onPerPageChange?.(Number(e.target.value))}
              className="border rounded px-2 py-1.5 text-sm bg-white"
              style={{ borderColor: "var(--table-border)" }}
            >
              {perPageOptions.map((n) => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => pagination.onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-sm font-medium border rounded disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              style={{ borderColor: "var(--table-border)" }}
            >
              &lt; Previous
            </button>
            <span
              className="px-3 py-1.5 text-sm border rounded bg-white"
              style={{ borderColor: "var(--table-border)" }}
            >
              Page {pagination.page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => pagination.onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="px-3 py-1.5 text-sm font-medium border rounded disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              style={{ borderColor: "var(--table-border)" }}
            >
              Next &gt;
            </button>
          </div>

        </div>

      )}

    </div>
  );
}

export default memo(Table);

/* -------------------------------- */
/* Filter Components */
/* -------------------------------- */

export const TableFilterBar = ({ children }) => (
  <div className="flex flex-wrap items-end gap-4">{children}</div>
);

export function TableFilterBarWithSearch({ search, export: exportProp, import: importProp, filter, filterVariant = "panel", children }) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="space-y-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-4 min-w-0">
          {search && <div className="min-w-[200px] max-w-md shrink-0">{search}</div>}
        </div>
        <div className="flex flex-wrap items-end gap-3 shrink-0">
          {exportProp && (
            <button
              type="button"
              onClick={exportProp.onClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border shrink-0"
              style={{ borderColor: "var(--table-border)" }}
            >
              <ExportIcon />
              {exportProp.label ?? "Export"}
            </button>
          )}
          {importProp && (
            <button
              type="button"
              onClick={importProp.onClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border shrink-0"
              style={{ borderColor: "var(--table-border)" }}
            >
              <DownloadIcon />
              {importProp.label ?? "Import"}
            </button>
          )}
          {children}
          {filter && filterVariant === "dropdown" && (
            <TableFilterDropdown
              label={filter.label ?? "Filter"}
              onApply={filter.onApply}
              onClear={filter.onClear}
              activeCount={filter.activeCount ?? 0}
            >
              {filter.children}
            </TableFilterDropdown>
          )}
          {filter && filterVariant === "panel" && (
            <button
              type="button"
              onClick={() => setPanelOpen((o) => !o)}
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium shrink-0"
              style={{ borderColor: "var(--table-border)" }}
            >
              <FilterIcon />
              {filter.label ?? "Filter"}
              {(filter.activeCount ?? 0) > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ background: "var(--table-primary)" }}>
                  {filter.activeCount}
                </span>
              )}
              <ChevronDownIcon />
            </button>
          )}
          {filter && filterVariant === "panel" && (
          <button
            type="button"
            onClick={() => { filter.onClear?.(); setPanelOpen(false); }}
            className="px-4 py-2 text-sm font-medium rounded-md border"
            style={{ borderColor: "var(--table-border)" }}
          >
            Clear
          </button>
          )}
        </div>
      </div>
      {filter && filterVariant === "panel" && panelOpen && (
        <div
          className="mt-4 pt-4  flex flex-wrap items-end justify-between gap-4"
          style={{ borderColor: "var(--table-border)" }}
        >
          <div className="flex flex-wrap items-end gap-4 flex-1 min-w-0">
            {filter.children}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => { filter.onApply?.(); }}
              className="px-4 py-2 text-sm font-medium rounded-md text-white"
              style={{ background: "var(--table-primary)" }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Standalone expandable filter panel. Use in any component when you need
 * a filter that expands above content (e.g. above a table).
 * Props: label, children, onApply, onClear, activeCount
 */
export function TableFilterPanel({ label = "Filter", children, onApply, onClear, activeCount = 0 }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium shrink-0"
        style={{ borderColor: "var(--table-border)" }}
      >
        <FilterIcon />
        {label}
        {activeCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ background: "var(--table-primary)" }}>
            {activeCount}
          </span>
        )}
        <ChevronDownIcon />
      </button>
      {open && (
        <div
          className="mt-4 pt-4 border-t flex flex-wrap items-end justify-between gap-4"
          style={{ borderColor: "var(--table-border)" }}
        >
          <div className="flex flex-wrap items-end gap-4 flex-1 min-w-0">
            {children}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => { onApply?.(); }}
              className="px-4 py-2 text-sm font-medium rounded-md text-white"
              style={{ background: "var(--table-primary)" }}
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => { onClear?.(); setOpen(false); }}
              className="px-4 py-2 text-sm font-medium rounded-md border"
              style={{ borderColor: "var(--table-border)" }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TableFilterDropdown({ label = "Filter", children, onApply, onClear, activeCount = 0 }) {

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {

    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  return (

    <div className="relative" ref={ref}>

      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium">

        <FilterIcon />
        {label}

        {activeCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded text-white"
            style={{ background: "var(--table-primary)" }}>
            {activeCount}
          </span>
        )}

        <ChevronDownIcon />

      </button>

      {open && (

        <div className="absolute right-0 mt-1 z-50 min-w-[240px] rounded-lg shadow-lg border p-4 bg-white">

          <div className="space-y-4 mb-4">
            {children}
          </div>

          <div className="flex justify-between gap-2 pt-2 border-t">

            <button
              onClick={() => { onApply?.(); setOpen(false); }}
              className="px-3 py-1.5 text-sm rounded text-white"
              style={{ background: "var(--table-primary)" }}>
              Apply
            </button>

            <button
              onClick={() => { onClear?.(); setOpen(false); }}
              className="px-3 py-1.5 text-sm rounded border">
              Clear
            </button>

          </div>

        </div>

      )}

    </div>

  );
}

/* -------------------------------- */
/* Search Input */
/* -------------------------------- */

export const TableSearchInput = ({ label = "Search", placeholder = "Search...", value, onChange }) => (

  <div className="flex-1 min-w-[250px]">

    <label className="block text-xs font-medium mb-1 text-gray-500">
      {label}
    </label>

    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-md text-sm" />

  </div>

);

/* -------------------------------- */
/* Select */
/* -------------------------------- */

export const TableSelect = ({ label, value, onChange, options = [], placeholder }) => (

  <div>

    <label className="block text-xs font-medium mb-1 text-gray-500">
      {label}
    </label>

    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="px-3 py-2 border rounded-md text-sm">

      {placeholder && <option value="">{placeholder}</option>}

      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}

    </select>

  </div>

);

/* -------------------------------- */
/* Button */
/* -------------------------------- */

export const TableSearchButton = ({ onClick, children = "Search" }) => (

  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-md"
    style={{ background: "var(--table-primary)" }}>

    <SearchIcon />
    {children}

  </button>

);

/* -------------------------------- */
/* Checkbox */
/* -------------------------------- */

export const TableCheckbox = ({ label, checked, onChange, icon }) => (

  <label className="flex items-center gap-2 text-sm text-gray-500">

    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)} />

    {icon && <span className="opacity-70">{icon}</span>}

    {label}

  </label>

);