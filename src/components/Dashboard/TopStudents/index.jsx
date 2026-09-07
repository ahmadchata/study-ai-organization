import { useState } from "react";
import "./styles.css";
import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import LoadingTracker from "../../Common/Loading";

const MEDALS = ["🥇", "🥈", "🥉"];
const PAGE_SIZE = 10;

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const TopStudents = () => {
  const [page, setPage] = useState(1);

  const { data: topPerformers, isFetching } = useQuery({
    queryKey: ["topPerformers"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.topPerformers(true),
  });

  const students = topPerformers?.data?.students || [];
  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const pageStudents = students.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  if (isFetching) {
    return <LoadingTracker />;
  }

  return (
    <div>
      <h4 className="m-0">Top students</h4>
      <p className="grey-text mt-2 mb-4">
        The highest-ranking students this week based on points, activity, and
        performance.
      </p>

      <div className="card-panel p-3 p-lg-4">
        <div className="d-flex flex-column">
          {pageStudents.map((student, idx) => {
            const rank = (page - 1) * PAGE_SIZE + idx;
            return (
              <div
                key={student?.name}
                className="d-flex align-items-center justify-content-between top-student-row"
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="rank-marker">
                    {rank < 3 ? MEDALS[rank] : `#${rank + 1}`}
                  </span>
                  <span className="avatar-circle">
                    {initialsOf(student?.student_name)}
                  </span>
                  <span className="text-capitalize">
                    {student?.student_name}
                  </span>
                </div>
                <span className="pts-tag">
                  {student?.total_points?.toLocaleString?.() ??
                    student?.total_points}{" "}
                  <span className="grey-text">PTS</span>
                </span>
              </div>
            );
          })}

          {pageStudents.length === 0 && (
            <p className="grey-text m-0 py-4 text-center">No students yet</p>
          )}
        </div>

        {students.length > PAGE_SIZE && (
          <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              &lt; Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className="btn page-btn"
                style={{
                  backgroundColor: page === p ? "#0c7a50" : "transparent",
                  color: page === p ? "#fff" : "#000",
                  border: "1px solid #ddd",
                }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="btn btn-outline-secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopStudents;
