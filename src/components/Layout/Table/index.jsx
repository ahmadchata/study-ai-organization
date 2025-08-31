import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import "./styles.css";
import SearchIcon from "@mui/icons-material/Search";
import LaunchIcon from "@mui/icons-material/Launch";

const Table = ({ columns, data, rowProps }) => {
  const [search, setSearch] = useState("");
  const [exportTable, setExportTable] = useState(false);

  const toggleExportPdf = () => {
    setExportTable((prev) => !prev);
  };

  const filteredData = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(lower)
      )
    );
  }, [search, data]);

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
          return typeof val === "string" || typeof val === "number" ? val : "";
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
          return typeof val === "string" || typeof val === "number" ? val : "";
        })
    );
    autoTable(doc, { head: headers, body: rows });
    doc.save("table-data.pdf");
  };

  return (
    <div className="tanstack-table-wrapper p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="table-search-bar px-2">
          <input
            type="text"
            className="form-control py-2"
            placeholder="Search for anything"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon />
        </div>
        <div className="d-flex gap-2 position-relative">
          <button
            className="btn dsh-btn d-inline-flex align-items-center"
            onClick={toggleExportPdf}
          >
            Export PDF/CSV <LaunchIcon style={{ marginLeft: "8px" }} />
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
      <table className="tanstack-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} {...(rowProps ? rowProps(row) : {})}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
