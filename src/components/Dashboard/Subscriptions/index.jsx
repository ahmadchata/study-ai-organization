import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import Table from "../../Layout/Table";
import LoadingTracker from "../../Common/Loading";
import "./styles.css";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const Subscriptions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: overview, isFetching: isFetchingOverview } = useQuery({
    queryKey: ["overview"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.overview(true),
  });

  const { data: subscriptions, isFetching: isFetchingSubs } = useQuery({
    queryKey: ["subscriptions", currentPage, debouncedSearchTerm],
    queryFn: () =>
      DashboardAPI.getSubscriptions(currentPage, debouncedSearchTerm, true),
  });

  if (isFetchingOverview) {
    return <LoadingTracker />;
  }

  const totalLicenses = subscriptions?.total_subscriptions || 0;
  const usedLicenses = overview?.statistics?.students_with_subscriptions || 0;
  const usagePct = totalLicenses
    ? Math.min(100, Math.round((usedLicenses / totalLicenses) * 100))
    : 0;

  const data = subscriptions?.subscriptions || [];

  const columns = [
    {
      header: "Student",
      accessorKey: "student_info",
      cell: ({ row }) => {
        const name =
          row.original.student_info?.student_name || row.original.student;
        return (
          <div className="d-flex align-items-center gap-2">
            <span className="avatar-circle">{initialsOf(name)}</span>
            <span className="text-capitalize">{name}</span>
          </div>
        );
      },
    },
    {
      header: "Code",
      accessorKey: "subscription_code",
    },
    {
      header: "Type",
      accessorKey: "subscription_type",
      cell: ({ row }) => (
        <span className="text-capitalize">
          {row.original.subscription_type}
        </span>
      ),
    },
    {
      header: "Start date",
      accessorKey: "start_date",
    },
    {
      header: "End date",
      accessorKey: "end_date",
    },
    {
      header: "Source",
      accessorKey: "source_type",
    },
  ];

  return (
    <div>
      <div className="card-panel p-4 mb-4">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="m-0">Institutional License</h6>
              <span className="license-badge">Active</span>
            </div>
            <p className="grey-text mt-1 mb-0">Renews on June 1, 2026</p>
          </div>
        </div>

        <div className="row mx-0 mt-4">
          <div className="col-12 col-md-6 px-0">
            <label className="grey-text small-text">Monthly cost</label>
            <h2 className="m-0">₦{totalLicenses * 2300}</h2>
            <p className="grey-text small-text mt-1">
              ₦2,300 per student / month
            </p>
            <Link
              to="/dashboard/subscriptions/purchase-code"
              className="text-decoration-none"
            >
              <button className="btn default-btn mt-3 px-4 py-2">
                Get more license
              </button>
            </Link>
          </div>
          <div className="col-12 col-md-6 px-0 mt-4 mt-md-0">
            <label className="grey-text small-text">Student licenses</label>
            <h4 className="m-0 mt-1">
              {usedLicenses}/{totalLicenses || usedLicenses}
            </h4>
            <div className="license-progress mt-2">
              <div
                className="license-progress-fill"
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={data}
        isFetching={isFetchingSubs}
        rowProps={() => ({})}
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        hideExport
      />

      {subscriptions?.total_pages > 1 && (
        <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!subscriptions?.has_previous}
          >
            &lt;
          </button>
          {Array.from(
            { length: subscriptions?.total_pages || 1 },
            (_, i) => i + 1,
          ).map((page) => (
            <button
              key={page}
              className="btn"
              onClick={() => setCurrentPage(page)}
              style={{
                minWidth: "32px",
                padding: "4px 8px",
                backgroundColor:
                  currentPage === page ? "#0c7a50" : "transparent",
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
            disabled={!subscriptions?.has_next}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
