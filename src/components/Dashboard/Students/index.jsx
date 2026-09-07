import { useState, useEffect } from "react";
import Table from "../../Layout/Table";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import { SubscriptionAPI } from "../../../api/SubscriptionAPI";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "./styles.css";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const Students = () => {
  const [actionMenuRow, setActionMenuRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: overview } = useQuery({
    queryKey: ["overview"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.overview(true),
  });

  const { data: students, isFetching } = useQuery({
    queryKey: ["students", currentPage, debouncedSearchTerm],
    queryFn: () =>
      DashboardAPI.getStudents(currentPage, debouncedSearchTerm, true),
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
        style: { backgroundColor: "#fff", color: "#0c7a50" },
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (error) => {
      setLoading(false);
      enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
    },
  });

  const revokeAccess = (subCode) => {
    mutation.mutate({ subscription_code: subCode });
  };

  const data = students?.students;

  const columns = [
    {
      header: "Name",
      accessorKey: "student_name",
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-2">
          <span className="avatar-circle">
            {initialsOf(row.original.student_name)}
          </span>
          <span className="text-capitalize">{row.original.student_name}</span>
        </div>
      ),
    },
    {
      header: "Phone number",
      accessorKey: "phone_number",
      cell: ({ row }) => row.original.phone_number || "—",
    },
    {
      header: "Performance",
      accessorKey: "performance",
      cell: ({ row }) =>
        row.original.performance !== undefined &&
        row.original.performance !== null
          ? `${row.original.performance}%`
          : "—",
    },
    {
      header: "Exams",
      accessorKey: "exams_completed",
      cell: ({ row }) =>
        row.original.exams_completed !== undefined
          ? `${row.original.exams_completed} completed`
          : "—",
    },
    {
      header: "Last active",
      accessorKey: "last_login",
      cell: ({ row }) =>
        row.original.last_login
          ? (dayjs(row.original.last_login).fromNow?.() ??
            dayjs(row.original.last_login).format("DD-MMM"))
          : "—",
    },
    {
      header: "",
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
                      row.original.active_subscription?.subscription_code,
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

  const rowProps = () => ({});

  return (
    <div>
      <div className="row mx-0 g-3 mb-4">
        <div className="col-12 col-lg-4 px-0 pe-lg-2">
          <div className="stat-card d-flex align-items-start justify-content-between">
            <div>
              <label>Total Students</label>
              <h3>
                {overview?.statistics?.total_students ?? data?.length ?? 0}
              </h3>
            </div>
            <span className="stat-icon">
              <GroupOutlinedIcon style={{ color: "#0c7a50" }} />
            </span>
          </div>
        </div>

        <div className="col-12 col-lg-4 px-0 px-lg-2">
          <div className="stat-card d-flex align-items-start justify-content-between">
            <div>
              <label>Active This Week</label>
              <h3>{overview?.statistics?.students_with_subscriptions ?? 0}</h3>
            </div>
            <span className="stat-icon">
              <TrendingUpOutlinedIcon style={{ color: "#0c7a50" }} />
            </span>
          </div>
        </div>

        <div className="col-12 col-lg-4 px-0 ps-lg-2">
          <div className="stat-card d-flex align-items-start justify-content-between">
            <div>
              <label>Avg. Performance</label>
              <h3>{overview?.statistics?.avg_performance ?? "—"}</h3>
            </div>
            <span className="stat-icon">
              <BarChartOutlinedIcon style={{ color: "#0c7a50" }} />
            </span>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        isFetching={isFetching}
        data={data || []}
        rowProps={rowProps}
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        actions={
          <>
            {/* <button className="btn dsh-btn px-3">Filter by</button> */}
            <Link to="/dashboard/students/add" className="text-decoration-none">
              <button className="btn default-btn d-inline-flex align-items-center gap-1 px-3">
                <AddIcon fontSize="small" /> Add student
              </button>
            </Link>
          </>
        }
      />
      <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={!students?.has_previous}
        >
          &lt;
        </button>
        {Array.from(
          { length: students?.total_pages || 1 },
          (_, i) => i + 1,
        ).map((page) => (
          <button
            key={page}
            className="btn"
            onClick={() => setCurrentPage(page)}
            style={{
              minWidth: "32px",
              padding: "4px 8px",
              backgroundColor: currentPage === page ? "#0c7a50" : "transparent",
              color: currentPage === page ? "#fff" : "#000",
              border: "1px solid #ddd",
            }}
          >
            {page}
          </button>
        ))}
        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={!students?.has_next}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Students;
