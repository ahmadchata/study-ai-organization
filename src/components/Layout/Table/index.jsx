import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import CircularProgress from "@mui/material/CircularProgress";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import "./styles.css";
import SearchIcon from "@mui/icons-material/Search";
import LaunchIcon from "@mui/icons-material/Launch";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Table = ({
  columns,
  data,
  rowProps,
  statusAccessor,
  onSearch,
  searchValue,
  isFetching,
}) => {
  const [search, setSearch] = useState(searchValue || "");
  const [exportTable, setExportTable] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  // Responsive: detect mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Helper to toggle row expansion
  const toggleRow = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const toggleExportPdf = () => {
    setExportTable((prev) => !prev);
  };

  const filteredData = useMemo(() => {
    let result = data;
    // Only apply client-side search filtering if no server-side search is provided
    if (search && !onSearch) {
      const lower = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(lower)
        )
      );
    }

    // Apply subscription status filter if provided
    if (statusAccessor && statusFilter) {
      result = result.filter((row) => {
        const val = row?.[statusAccessor];
        let status;
        if (statusAccessor === "student_info") {
          status =
            val !== null && typeof val !== "undefined" ? "Active" : "Inactive";
        } else {
          status = typeof val === "string" ? val : "";
        }
        return status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    return result;
  }, [search, data, statusAccessor, statusFilter, onSearch]);

  const table = useReactTable({
    columns,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExportCSV = () => {
    const headers = table
      .getAllColumns()
      .filter((col) => col.getIsVisible() && col.id !== "select")
      .map((col) =>
        col.columnDef.header && typeof col.columnDef.header === "string"
          ? col.columnDef.header
          : col.id
      );
    const rows = table.getRowModel().rows.map((row) =>
      row
        .getVisibleCells()
        .filter((cell) => cell.column.id !== "select")
        .map((cell) => {
          const val = cell.getValue();
          if (typeof val === "string" || typeof val === "number") return val;

          const accessor = cell.column.columnDef.accessorKey || cell.column.id;
          const orig = row.original?.[accessor];

          if (accessor === "student_info") {
            return orig !== null && typeof orig !== "undefined"
              ? "Active"
              : "Inactive";
          }

          if (typeof orig === "string" || typeof orig === "number") return orig;
          if (orig === null || typeof orig === "undefined") return "";
          try {
            return JSON.stringify(orig);
          } catch {
            return "";
          }
        })
    );
    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "table-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const headers = [
      table
        .getAllColumns()
        .filter((col) => col.getIsVisible() && col.id !== "select")
        .map((col) =>
          col.columnDef.header && typeof col.columnDef.header === "string"
            ? col.columnDef.header
            : col.id
        ),
    ];
    const rows = table.getRowModel().rows.map((row) =>
      row
        .getVisibleCells()
        .filter((cell) => cell.column.id !== "select")
        .map((cell) => {
          const val = cell.getValue();
          if (typeof val === "string" || typeof val === "number") return val;

          const accessor = cell.column.columnDef.accessorKey || cell.column.id;
          const orig = row.original?.[accessor];

          if (accessor === "student_info") {
            return orig !== null && typeof orig !== "undefined"
              ? "Active"
              : "Inactive";
          }

          if (typeof orig === "string" || typeof orig === "number") return orig;
          if (orig === null || typeof orig === "undefined") return "";
          try {
            return JSON.stringify(orig);
          } catch {
            return "";
          }
        })
    );
    autoTable(doc, { head: headers, body: rows });
    doc.save("table-data.pdf");
  };

  // if (data?.length === 0) {
  //   return <p>No data</p>;
  // }

  return (
    <div className="tanstack-table-wrapper p-4">
      <div className="d-block d-lg-flex justify-content-between mb-4">
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div className="table-search-bar px-2">
            <input
              type="text"
              className="form-control py-2"
              placeholder="Search for anything"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (onSearch) {
                  onSearch(e.target.value);
                }
              }}
            />
            <SearchIcon />
          </div>
          {statusAccessor && (
            <>
              <label className="ms-4 text-muted">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-2"
                style={{
                  minWidth: "140px",
                  // padding: "8px 12px",
                  borderRadius: "12px",
                  border: "1px solid #eaeaea",
                  fontSize: "1rem",
                }}
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </>
          )}
        </div>
        <div className="d-flex gap-2 position-relative mt-4 mt-lg-0">
          <button className="btn dsh-btn px-3" onClick={toggleExportPdf}>
            Export PDF/CSV <LaunchIcon fontSize="small" />
          </button>
          {exportTable && (
            <div
              className={`context-menu bg-white position-absolute rounded-4 p-4 border border-2`}
              style={{ minInlineSize: "280px" }}
            >
              <div>
                <button
                  className="btn me-3 csv-btn text-white"
                  onClick={handleExportCSV}
                >
                  Export CSV
                </button>
                <button
                  className="btn pdf-btn text-white"
                  onClick={handleExportPDF}
                >
                  Export PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isFetching && (
        <CircularProgress size={"20px"} style={{ color: "#0c7a50" }} />
      )}
      {!data ? (
        <p>No data</p>
      ) : (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <table className="tanstack-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) =>
                    isMobile && idx > 1 ? null : (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    )
                  )}
                  {isMobile && <th></th>}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                const visibleCells = row.getVisibleCells();
                return (
                  <React.Fragment key={row.id}>
                    <tr {...(rowProps ? rowProps(row) : {})}>
                      {visibleCells.map((cell, idx) =>
                        isMobile && idx > 1 ? null : (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      )}
                      {isMobile && (
                        <td>
                          <button
                            className="btn btn-link-dark p-0"
                            onClick={() => toggleRow(row.id)}
                            aria-label="Show more"
                          >
                            <KeyboardArrowDownIcon
                              style={{
                                transform: expandedRows.includes(row.id)
                                  ? "rotate(180deg)"
                                  : "none",
                                transition: "transform 0.2s",
                              }}
                            />
                          </button>
                        </td>
                      )}
                    </tr>
                    {isMobile && expandedRows.includes(row.id) && (
                      <tr key={row.id + "-expanded"}>
                        <td
                          colSpan={3}
                          style={{
                            background: "#E9EBED",
                            borderTop: "none",
                            padding: 0,
                          }}
                        >
                          <div className="p-3">
                            {visibleCells.slice(2).map((cell) => (
                              <div
                                key={cell.id}
                                className="py-3 d-flex justify-content-between"
                                style={{ marginBottom: 3 }}
                              >
                                {cell.column.columnDef.header}{" "}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;
