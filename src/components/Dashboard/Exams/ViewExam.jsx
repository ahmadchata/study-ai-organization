import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { ExamAPI } from "../../../api/ExamAPI";
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

const STATUS_STYLES = {
  Completed: "status-badge status-badge-green",
  "In Progress": "status-badge status-badge-amber",
  "Not Started": "status-badge status-badge-grey",
};

const statusClass = (status) =>
  STATUS_STYLES[status] || "status-badge status-badge-grey";

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ViewExam = () => {
  const { examId } = useParams();

  const { data, isFetching, error } = useQuery({
    queryKey: ["examResults", examId],
    queryFn: () => ExamAPI.getExamResults(examId, true),
    enabled: !!examId,
  });

  if (isFetching) {
    return <LoadingTracker />;
  }

  if (error || !data?.data?.exam) {
    return <p className="grey-text py-4">Could not load this exam.</p>;
  }

  const { exam, results = [] } = data.data;

  const subjects =
    Array.isArray(exam.subjects) && exam.subjects.length > 0
      ? exam.subjects.join(", ")
      : "No subjects specified";

  const completedCount = results.filter(
    (r) => r.status === "Completed",
  ).length;

  return (
    <div>
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h4 className="m-0">{exam.exam_title}</h4>
            <span
              className={`status-badge ${exam.is_active ? "status-badge-green" : "status-badge-grey"}`}
            >
              {exam.is_active ? "Active" : "Inactive"}
            </span>
            <span
              className={`status-badge ${exam.is_open ? "status-badge-green" : "status-badge-grey"}`}
            >
              {exam.is_open ? "Open" : "Closed"}
            </span>
          </div>
          {exam.description && (
            <p className="grey-text mt-2 mb-0">{exam.description}</p>
          )}
        </div>
      </div>

      <div className="row mx-0 g-3 mb-4">
        <div className="col-6 col-lg-3 px-0 pe-lg-2">
          <div className="stat-card d-flex align-items-start justify-content-between">
            <div>
              <label>Students</label>
              <h3>{exam.assigned_students?.length || 0}</h3>
            </div>
            <span className="stat-icon">
              <GroupOutlinedIcon style={{ color: "#0c7a50" }} />
            </span>
          </div>
        </div>
        <div className="col-6 col-lg-3 px-0 px-lg-2">
          <div className="stat-card d-flex align-items-start justify-content-between">
            <div>
              <label>Questions</label>
              <h3>{exam.question_count ?? 0}</h3>
            </div>
            <span className="stat-icon">
              <QuizOutlinedIcon style={{ color: "#0c7a50" }} />
            </span>
          </div>
        </div>
        <div className="col-6 col-lg-3 px-0 px-lg-2">
          <div className="stat-card d-flex align-items-start justify-content-between">
            <div>
              <label>Content items</label>
              <h3>{exam.content_count ?? 0}</h3>
            </div>
            <span className="stat-icon">
              <ArticleOutlinedIcon style={{ color: "#0c7a50" }} />
            </span>
          </div>
        </div>
        <div className="col-6 col-lg-3 px-0 ps-lg-2">
          <div className="stat-card d-flex align-items-start justify-content-between">
            <div>
              <label>Duration</label>
              <h3>{exam.duration_minutes} min</h3>
            </div>
            <span className="stat-icon">
              <AccessTimeOutlinedIcon style={{ color: "#0c7a50" }} />
            </span>
          </div>
        </div>
      </div>

      <div className="card-panel p-4 mb-4">
        <h6 className="mb-3">Exam details</h6>
        <div className="row mx-0 g-4">
          <div className="col-6 col-md-3 px-0">
            <label className="grey-text small-text">Subjects</label>
            <p className="m-0 mt-1">{subjects}</p>
          </div>
          <div className="col-6 col-md-3 px-0">
            <label className="grey-text small-text">Questions per attempt</label>
            <p className="m-0 mt-1">{exam.questions_per_attempt}</p>
          </div>
          <div className="col-6 col-md-3 px-0">
            <label className="grey-text small-text">Opens</label>
            <p className="m-0 mt-1">
              {exam.opening_date} · {exam.exam_start_time}
            </p>
          </div>
          <div className="col-6 col-md-3 px-0">
            <label className="grey-text small-text">Closes</label>
            <p className="m-0 mt-1">{exam.closing_date}</p>
          </div>
          <div className="col-6 col-md-3 px-0">
            <label className="grey-text small-text">Shuffle questions</label>
            <p className="m-0 mt-1">{exam.shuffle_questions ? "Yes" : "No"}</p>
          </div>
          <div className="col-6 col-md-3 px-0">
            <label className="grey-text small-text">
              Shuffle answer options
            </label>
            <p className="m-0 mt-1">
              {exam.shuffle_answer_options ? "Yes" : "No"}
            </p>
          </div>
          <div className="col-6 col-md-3 px-0">
            <label className="grey-text small-text">Allow retakes</label>
            <p className="m-0 mt-1">{exam.allow_retakes ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      <div className="card-panel p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="m-0">Results</h6>
          <span className="grey-text small-text">
            {completedCount} of {results.length} completed
          </span>
        </div>

        <div className="table-responsive">
          <table className="results-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Percentage</th>
                <th>Started</th>
                <th>Completed</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.name}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="avatar-circle">
                        {initialsOf(result.student_name)}
                      </span>
                      <span className="text-capitalize">
                        {result.student_name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={statusClass(result.status)}>
                      {result.status}
                    </span>
                  </td>
                  <td>{result.score}</td>
                  <td>
                    {result.correct_answers}/{result.total_questions}
                  </td>
                  <td>{result.percentage}%</td>
                  <td className="grey-text">
                    {formatDateTime(result.started_at)}
                  </td>
                  <td className="grey-text">
                    {formatDateTime(result.completed_at)}
                  </td>
                  <td className="grey-text">
                    {result.duration_minutes
                      ? `${result.duration_minutes} min`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && (
            <p className="grey-text text-center py-4 m-0">
              No students have started this exam yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewExam;
