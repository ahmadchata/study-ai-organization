import "./styles.css";
import { Link } from "react-router-dom";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../../api/DashboardAPI";
import LoadingTracker from "../Common/Loading";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RECENT_ACTIVITY = [
  { name: "Chinedu Okafor", description: "Completed Algebra Mock #4 · Grade 11", date: "2m ago" },
  { name: "Liam O'Connor", description: "Started Biology session · Grade 10", date: "8m ago" },
  { name: "Priya Shah", description: "Submitted Physics quiz · Grade 12", date: "14m ago" },
  { name: "Noah Becker", description: "Reviewed History flashcards · Grade 9", date: "23m ago" },
  { name: "Sofia Russo", description: "Completed English Mock #2 · Grade 11", date: "41m ago" },
];

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const Home = () => {
  const { data: overview, isFetching } = useQuery({
    queryKey: ["overview"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.overview(true),
  });

  const { data: engagements, isFetching: isFetchingEngagements } = useQuery({
    queryKey: ["engagements"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.getEngagements(true),
  });

  const { data: topPerformers, isFetching: isFetchingTop } = useQuery({
    queryKey: ["topPerformers"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.topPerformers(true),
  });

  if (isFetching) {
    return <LoadingTracker />;
  }

  const students = topPerformers?.data?.students?.slice(0, 6) || [];

  return (
    <div>
      <div className="row mx-0 g-3">
        <div className="col-12 col-lg-4 px-0 pe-lg-2">
          <div className="stat-card d-flex align-items-start justify-content-between">
            <div>
              <label>Total Students</label>
              <h3>{overview?.statistics?.total_students ?? 0}</h3>
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
              <label>Exams Completed</label>
              <h3>{overview?.statistics?.exams_completed ?? 0}</h3>
            </div>
            <span className="stat-icon">
              <MenuBookOutlinedIcon style={{ color: "#0c7a50" }} />
            </span>
          </div>
        </div>
      </div>

      <div className="row mx-0 mt-4 g-3">
        <div className="col-12 col-xl-8 px-0 pe-xl-2">
          <div className="card-panel p-3 p-lg-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="m-0">Learning Activity</h6>
              <div className="d-flex gap-2">
                <span className="chip-select">All exam</span>
                <span className="chip-select">All subject</span>
              </div>
            </div>
            {isFetchingEngagements ? (
              <LoadingTracker />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={engagements?.data?.engagement_data}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="students_count"
                    stroke="#0c7a50"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="col-12 col-xl-4 px-0 ps-xl-2">
          <div className="card-panel p-3 p-lg-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="m-0">Top students</h6>
            </div>
            {isFetchingTop ? (
              <LoadingTracker />
            ) : (
              <div className="d-flex flex-column gap-3">
                {students.map((student, index) => (
                  <div
                    key={student?.name}
                    className="d-flex align-items-center justify-content-between"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="rank-badge">
                        {index === 0 ? "👑" : `#${index + 1}`}
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
                ))}
                {students.length === 0 && (
                  <p className="grey-text m-0">No students yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-panel p-3 p-lg-4 mt-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="m-0">Recent Activity</h6>
          <Link to="/dashboard/students" className="text-decoration-none green-text">
            View all
          </Link>
        </div>
        <div className="table-responsive">
          <table className="recent-activity-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITY.map((activity) => (
                <tr key={activity.name}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="avatar-circle">
                        {initialsOf(activity.name)}
                      </span>
                      {activity.name}
                    </div>
                  </td>
                  <td className="grey-text">{activity.description}</td>
                  <td className="grey-text">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
