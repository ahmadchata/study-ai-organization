import { useState } from "react";
import Table from "../../Layout/Table";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import AddIcon from "@mui/icons-material/Add";
import "./styles.css";
import { DashboardAPI } from "../../../api/DashboardAPI";
import { useQuery } from "@tanstack/react-query";
import LoadingTracker from "../../Common/Loading";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";

const Subscriptions = () => {
  const [selected, setSelected] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const { data: subscriptions, isFetching } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => DashboardAPI.getSubscriptions(true),
  });

  const data = subscriptions?.subscriptions;

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    enqueueSnackbar("Access code copied", {
      autoHideDuration: 1000,
      style: {
        backgroundColor: "#fff",
        color: "#0c7a50",
      },
    });
  };

  const getColumns = (selected, onSelectAll, onSelectRow, hoveredRow) => [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={selected?.length === data?.length && data?.length > 0}
          indeterminate={
            selected?.length > 0 && selected?.length < data?.length
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
      header: "Access codes",
      accessorKey: "subscription_code",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {row.original.subscription_code}
          {hoveredRow === row.id && (
            <ContentCopyIcon
              style={{ color: "#000", fontSize: "16px", cursor: "pointer" }}
              onClick={() => copyToClipboard(row.original.subscription_code)}
            />
          )}
        </span>
      ),
    },
    {
      header: "Expiry date",
      accessorKey: "end_date",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {row.original.end_date}
        </span>
      ),
    },
    {
      header: "First use",
      accessorKey: "start_date",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {row.original.start_date}
        </span>
      ),
    },
    {
      header: "Subscription status",
      accessorKey: "subscriptionStatus",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            className={
              row.original.student_info !== null ? "green-dot" : "red-dot"
            }
          ></span>
          {row.original.student_info !== null ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

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

  if (isFetching) {
    return <LoadingTracker />;
  }

  return (
    <div className="px-lg-5 px-2">
      <div className="my-5 d-block d-lg-flex justify-content-between justify-content-lg-start">
        <button className="btn dsh-btn d-inline-flex align-items-center me-md-3">
          <span className="icon-btn d-inline-flex align-items-center me-2">
            <PeopleOutlineIcon style={{ fontSize: "18px" }} />
          </span>
          Total Access Codes:{" "}
          <span className="ms-2 green-text">
            {subscriptions?.total_subscriptions}
          </span>
        </button>
        <Link
          to="/dashboard/subscriptions/purchase-code"
          className="text-decoration-none text-dark"
        >
          <button className="ms-lg-4 mt-3 mt-md-0 btn dsh-btn green-text d-inline-flex align-items-center py-3 px-3">
            <AddIcon />
            Purchase new codes
          </button>
        </Link>
      </div>
      <Table columns={columns} data={data} rowProps={rowProps} />
    </div>
  );
};

export default Subscriptions;
