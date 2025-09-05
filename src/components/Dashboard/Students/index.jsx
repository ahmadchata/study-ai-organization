import { useState } from "react";
import Table from "../../Layout/Table";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import { SubscriptionAPI } from "../../../api/SubscriptionAPI";
import LoadingTracker from "../../Common/Loading";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import "./styles.css";

const Students = () => {
  const [selected, setSelected] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [actionMenuRow, setActionMenuRow] = useState(null);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: students, isFetching } = useQuery({
    queryKey: ["students"],
    queryFn: () => DashboardAPI.getStudents(true),
  });

  const mutation = useMutation({
    mutationFn: (code) => {
      setLoading(true);
      const response = SubscriptionAPI.revokeSubscription(code, true);
      return response;
    },
    onSuccess: () => {
      setLoading(false);
      enqueueSnackbar("Success", {
        autoHideDuration: 1000,
        style: {
          backgroundColor: "#fff",
          color: "#0c7a50",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (error) => {
      setLoading(false);
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
    },
  });

  const revokeAccess = (subCode) => {
    mutation.mutate({
      subscription_code: subCode,
    });
  };

  const data = students?.students;

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
      header: "Name",
      accessorKey: "student_name",
    },
    {
      header: "Access codes",
      accessorKey: "active_subscription?.subscription_code",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {row.original.active_subscription?.subscription_code}
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
      header: "Study points",
      accessorKey: "studyPoints",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {row.original.studyPoints}
        </span>
      ),
    },
    {
      header: "Last login",
      accessorKey: "lastLogin",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {dayjs(row.original.last_login).format("DD-MMM")}
        </span>
      ),
    },
    {
      header: "Days remaining",
      accessorKey: "days_remaining",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {row.original.days_remaining}
        </span>
      ),
    },
    {
      header: "Subscription status",
      accessorKey: "subscription_status",
      cell: ({ row }) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            className={
              row.original.subscription_status === "Active"
                ? "green-dot"
                : "red-dot"
            }
          ></span>
          {row.original.subscription_status}
        </span>
      ),
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => (
        <div style={{ position: "relative" }}>
          <button className="btn" onClick={() => setActionMenuRow(row.id)}>
            <MoreHorizIcon />
          </button>
          {actionMenuRow === row.id && row.original.active_subscription && (
            <ClickAwayListener onClickAway={() => setActionMenuRow(null)}>
              <div className="context-menu">
                <button
                  className="dropdown-item w-100 text-start px-3 py-2 text-danger d-flex align-items-center"
                  style={{ border: "none", background: "none" }}
                  disabled={loading}
                  onClick={() =>
                    revokeAccess(
                      row.original.active_subscription?.subscription_code
                    )
                  }
                >
                  {loading ? (
                    "Revoking..."
                  ) : (
                    <>
                      <DeleteOutlineIcon /> Revoke Access
                    </>
                  )}
                </button>
              </div>
            </ClickAwayListener>
          )}
        </div>
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
      <div className="my-5 d-flex justify-content-between justify-content-lg-start">
        <button className="btn dsh-btn d-inline-flex align-items-center">
          <span className="icon-btn d-inline-flex align-items-center me-2">
            <PeopleOutlineIcon style={{ fontSize: "18px" }} />
          </span>
          Total Students:{" "}
          <span className="ms-2 green-text">{data?.length}</span>
        </button>
        {/* <button className="ms-4 btn dsh-btn green-text d-inline-flex align-items-center py-3 px-3">
          <AddIcon />
          Add students
        </button> */}
      </div>
      <Table columns={columns} data={data} rowProps={rowProps} />
    </div>
  );
};

export default Students;
