import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Table from "../../Layout/Table";
import { ExamAPI } from "../../../api/ExamAPI";
import "./styles.css";

const subjectsToText = (subjects) => {
  if (!subjects) return "—";
  if (Array.isArray(subjects)) return subjects.join(", ") || "—";
  if (typeof subjects === "string") {
    try {
      const parsed = JSON.parse(subjects);
      if (Array.isArray(parsed)) return parsed.join(", ") || "—";
    } catch {
      return subjects;
    }
  }
  return String(subjects);
};

const studentsCountOf = (exam) =>
  exam.assigned_students?.length ??
  exam.student_count ??
  exam.students_count ??
  0;

const Exams = () => {
  const [actionMenuRow, setActionMenuRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data, isFetching } = useQuery({
    queryKey: ["organizationExams"],
    queryFn: () => ExamAPI.listExams(true),
  });

  const deleteMutation = useMutation({
    mutationFn: (organizationExamId) =>
      ExamAPI.deleteExam(organizationExamId, true),
    onSuccess: () => {
      enqueueSnackbar("Exam deleted", {
        style: { backgroundColor: "#fff", color: "#0c7a50" },
      });
      queryClient.invalidateQueries({ queryKey: ["organizationExams"] });
    },
    onError: (error) => {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to delete exam",
        { variant: "error" },
      );
    },
  });

  const handleDelete = (exam) => {
    setActionMenuRow(null);
    const id = exam.organization_exam_id;
    if (!id) return;
    if (
      window.confirm(
        `Delete "${exam.exam_title}"? This cannot be undone.`,
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const exams = data?.data || [];
  const filtered = exams.filter((exam) =>
    (exam.exam_title || exam.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      header: "Title",
      accessorKey: "exam_title",
      cell: ({ row }) => (
        <div className="d-flex align-items-center gap-2">
          <span className="exam-icon">
            <MenuBookOutlinedIcon fontSize="small" style={{ color: "#0c7a50" }} />
          </span>
          {row.original.exam_title || row.original.title}
        </div>
      ),
    },
    {
      header: "Subjects",
      accessorKey: "subjects",
      cell: ({ row }) => subjectsToText(row.original.subjects),
    },
    {
      header: "Students",
      accessorKey: "students",
      cell: ({ row }) => studentsCountOf(row.original),
    },
    {
      header: "Opens",
      accessorKey: "opening_date",
      cell: ({ row }) => row.original.opening_date || "—",
    },
    {
      header: "Closes",
      accessorKey: "closing_date",
      cell: ({ row }) => row.original.closing_date || "—",
    },
    {
      header: "",
      accessorKey: "action",
      cell: ({ row }) => (
        <div style={{ position: "relative" }}>
          <button className="btn" onClick={() => setActionMenuRow(row.id)}>
            <MoreHorizIcon />
          </button>
          {actionMenuRow === row.id && (
            <ClickAwayListener onClickAway={() => setActionMenuRow(null)}>
              <div className="context-menu">
                <button
                  className="dropdown-item w-100 text-start px-3 py-2"
                  style={{ border: "none", background: "none" }}
                  onClick={() => setActionMenuRow(null)}
                >
                  View exam
                </button>
                <button
                  className="dropdown-item w-100 text-start px-3 py-2 text-danger"
                  style={{ border: "none", background: "none" }}
                  disabled={deleteMutation.isPending}
                  onClick={() => handleDelete(row.original)}
                >
                  Delete exam
                </button>
              </div>
            </ClickAwayListener>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        data={filtered}
        isFetching={isFetching}
        rowProps={() => ({})}
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        hideExport
        actions={
          <>
            <button className="btn dsh-btn px-3">Filter by</button>
            <Link to="/dashboard/exams/create" className="text-decoration-none">
              <button className="btn default-btn d-inline-flex align-items-center gap-1 px-3">
                <AddIcon fontSize="small" /> New Exam
              </button>
            </Link>
          </>
        }
      />
    </div>
  );
};

export default Exams;
