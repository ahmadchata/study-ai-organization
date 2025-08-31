import { useState } from "react";
import Table from "../../Layout/Table";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import AddIcon from "@mui/icons-material/Add";
import "./styles.css";

const getColumns = (selected, onSelectAll, onSelectRow, hoveredRow) => [
  {
    id: "select",
    header: () => (
      <input
        type="checkbox"
        checked={selected.length === data.length && data.length > 0}
        indeterminate={
          selected.length > 0 && selected.length < data.length
            ? "indeterminate"
            : undefined
        }
        onChange={onSelectAll}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={selected.includes(row.original.name)}
        onChange={() => onSelectRow(row.original.name)}
        aria-label={`Select ${row.original.name}`}
      />
    ),
    size: 32,
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Access codes",
    accessorKey: "accessCodes",
    cell: ({ row }) => (
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {row.original.accessCodes}
        {hoveredRow === row.id && (
          <ContentCopyIcon
            style={{ color: "#000", fontSize: "16px", cursor: "pointer" }}
          />
        )}
      </span>
    ),
  },
  {
    header: "Study points",
    accessorKey: "studyPoints",
  },
  {
    header: "Last login",
    accessorKey: "lastLogin",
  },
  {
    header: "Subscription status",
    accessorKey: "subscriptionStatus",
    cell: ({ row }) => (
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span
          className={
            row.original.subscriptionStatus === "Active"
              ? "green-dot"
              : "red-dot"
          }
        ></span>
        {row.original.subscriptionStatus}
      </span>
    ),
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: () => (
      <button className="btn">
        <MoreHorizIcon />
      </button>
    ),
  },
];

const data = [
  {
    name: "Alice Johnson",
    accessCodes: "AC123, AC456",
    studyPoints: 120,
    lastLogin: "2025-08-30",
    subscriptionStatus: "Active",
    action: "",
  },
  {
    name: "Bob Smith",
    accessCodes: "AC789",
    studyPoints: 95,
    lastLogin: "2025-08-29",
    subscriptionStatus: "Inactive",
    action: "",
  },
  {
    name: "Charlie Lee",
    accessCodes: "AC321, AC654",
    studyPoints: 150,
    lastLogin: "2025-08-28",
    subscriptionStatus: "Active",
    action: "",
  },
];

const Students = () => {
  const [selected, setSelected] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(data.map((row) => row.name));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const columns = getColumns(
    selected,
    handleSelectAll,
    handleSelectRow,
    hoveredRow,
    setHoveredRow
  );

  // Custom rowProps to handle hover
  const rowProps = (row) => ({
    onMouseEnter: () => setHoveredRow(row.id),
    onMouseLeave: () => setHoveredRow(null),
  });

  return (
    <div className="px-lg-5 px-2">
      <div className="my-5">
        <button className="btn dsh-btn d-inline-flex align-items-center">
          <span className="icon-btn d-inline-flex align-items-center me-2">
            <PeopleOutlineIcon style={{ fontSize: "18px" }} />
          </span>
          Total Students:{" "}
          <span className="ms-2 green-text">{data?.length}</span>
        </button>
        <button className="ms-4 btn dsh-btn green-text d-inline-flex align-items-center py-3 px-3">
          <AddIcon />
          Add students
        </button>
      </div>
      <Table columns={columns} data={data} rowProps={rowProps} />
    </div>
  );
};

export default Students;
