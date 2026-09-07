import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CheckIcon from "@mui/icons-material/Check";
import UploadIcon from "@mui/icons-material/UploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import { DashboardAPI } from "../../../api/DashboardAPI";
import { ExamAPI } from "../../../api/ExamAPI";
import "./styles.css";

const STEPS = [
  "Exam Info",
  "Questions & Content",
  "Configuration",
  "Schedule & Publish",
];

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const studentIdOf = (student) =>
  student?.name || student?.student_id || student?.id;

const WizardSteps = ({ step }) => (
  <div className="wizard-steps">
    {STEPS.map((label, idx) => {
      const num = idx + 1;
      const active = num === step;
      const done = num < step;
      return (
        <div key={label} className="d-flex align-items-center flex-fill">
          <div
            className={`wizard-step ${active ? "wizard-step-active" : ""} ${
              done ? "wizard-step-done" : ""
            }`}
          >
            <span className="wizard-step-circle">
              {done ? <CheckIcon fontSize="small" /> : num}
            </span>
            <span className="d-none d-md-inline">{label}</span>
          </div>
          {num < STEPS.length && (
            <div
              className={`wizard-connector ${done ? "wizard-connector-done" : ""}`}
            />
          )}
        </div>
      );
    })}
  </div>
);

const CreateExam = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(1);
  const [published, setPublished] = useState(false);
  const questionsFileRef = useRef(null);
  const contentFileRef = useRef(null);

  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [questionsFile, setQuestionsFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  const [questionsDragActive, setQuestionsDragActive] = useState(false);
  const [contentDragActive, setContentDragActive] = useState(false);

  const [questionsPerAttempt, setQuestionsPerAttempt] = useState(40);
  const [examDuration, setExamDuration] = useState(60);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(true);
  const [allowRetakes, setAllowRetakes] = useState(true);

  const [openingDate, setOpeningDate] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [debouncedStudentSearch, setDebouncedStudentSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedStudentSearch(studentSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [studentSearch]);

  const { data: studentsData, isFetching: isFetchingStudents } = useQuery({
    queryKey: ["students", "create-exam", debouncedStudentSearch],
    queryFn: () =>
      DashboardAPI.getStudents(1, debouncedStudentSearch, true, 100),
    enabled: step === 4,
  });

  const filteredStudents = studentsData?.students || [];

  const commitPendingSubject = () => {
    const value = subjectInput.trim();
    if (!value) return;
    setSubjects((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setSubjectInput("");
  };

  const addSubject = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitPendingSubject();
    }
  };

  const removeSubject = (subj) => {
    setSubjects((prev) => prev.filter((s) => s !== subj));
  };

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e, setDragActive) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e, setDragActive) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e, setFile, setDragActive) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(file);
  };

  const downloadTemplate = (templateType) => {
    try {
      ExamAPI.downloadTemplateFile(templateType);
    } catch {
      enqueueSnackbar("Failed to download template", { variant: "error" });
    }
  };

  const publishMutation = useMutation({
    mutationFn: async () => {
      let questionsFileUrl;
      let contentFileUrl;

      if (questionsFile) {
        const uploaded = await ExamAPI.uploadFile(questionsFile, true);
        questionsFileUrl = uploaded?.file_url;
      }
      if (contentFile) {
        const uploaded = await ExamAPI.uploadFile(contentFile, true);
        contentFileUrl = uploaded?.file_url;
      }

      const payload = {
        exam_title: examTitle,
        description: examDescription,
        subjects,
        questions_file: questionsFileUrl,
        content_file: contentFileUrl,
        questions_per_attempt: Number(questionsPerAttempt),
        exam_duration: Number(examDuration),
        shuffle_questions: shuffleQuestions ? 1 : 0,
        shuffle_answer_options: shuffleAnswers ? 1 : 0,
        allow_retakes: allowRetakes ? 1 : 0,
        opening_date: openingDate,
        closing_date: closingDate,
        exam_start_time: startTime,
        assign_students: selectedStudents,
      };

      // assign_students is already included in the create payload above,
      // so the separate assign endpoint isn't needed right after creation.
      const created = await ExamAPI.createExam(payload, true);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizationExams"] });
      setPublished(true);
    },
    onError: (error) => {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to publish exam",
        { variant: "error" },
      );
    },
  });

  if (published) {
    return (
      <div className="result-panel">
        <div className="result-icon">
          <CheckIcon fontSize="large" />
        </div>
        <h4>Exam published</h4>
        <p className="grey-text mt-3">
          Your exam has been published successfully. Assigned students will be
          notified and can begin at the scheduled time
        </p>
        <button
          className="btn default-btn mt-4 px-4"
          onClick={() => navigate("/dashboard/exams")}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div>
      <h4 className="m-0">Create CBT Exam</h4>
      <p className="grey-text mt-2 mb-4">
        Set up a new test for your students in a few simple steps
      </p>

      <WizardSteps step={step} />

      {step === 1 && (
        <div className="card-panel p-4" style={{ maxWidth: "700px" }}>
          <h6>Exam information</h6>
          <p className="grey-text mb-4">Basic details about your exam</p>

          <div className="mb-4">
            <label className="form-label">Exam title</label>
            <input
              type="text"
              className="cp-input"
              placeholder="Enter title for your exam"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Exam description (optional)</label>
            <textarea
              className="cp-input"
              rows={4}
              placeholder="Add notes or instructions for students"
              value={examDescription}
              onChange={(e) => setExamDescription(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Subjects</label>
            <input
              type="text"
              className="cp-input"
              placeholder="Enter the name of your subject"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              onKeyDown={addSubject}
              onBlur={commitPendingSubject}
            />
            {subjects.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-3">
                {subjects.map((s) => (
                  <span key={s} className="subject-chip">
                    {s}
                    <CloseIcon
                      fontSize="small"
                      className="pointer ms-1"
                      onClick={() => removeSubject(s)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card-panel p-4" style={{ maxWidth: "700px" }}>
          <div className="upload-info-banner mb-4">
            <InfoOutlinedIcon fontSize="small" />
            Upload the question bank and any supporting content for this exam.
            Questions are auto-detected on upload.
          </div>

          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="m-0">Questions file</h6>
              <button
                type="button"
                className="btn dsh-btn px-3 d-inline-flex align-items-center gap-1"
                onClick={() => downloadTemplate("questions")}
              >
                Download template
              </button>
            </div>
            <p className="grey-text mb-3">
              Upload the question bank covering:{" "}
              {subjects.join(", ") || "your subjects"}
            </p>
            <div
              className={`upload-dropzone ${questionsDragActive ? "upload-dropzone-active" : ""}`}
              onClick={() => questionsFileRef.current?.click()}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, setQuestionsDragActive)}
              onDragLeave={(e) => handleDragLeave(e, setQuestionsDragActive)}
              onDrop={(e) =>
                handleDrop(e, setQuestionsFile, setQuestionsDragActive)
              }
            >
              <span className="upload-dropzone-icon">
                <UploadIcon />
              </span>
              <p className="m-0 fw-medium">
                {questionsFile
                  ? questionsFile.name
                  : "Drag & drop your file here"}
              </p>
              <p className="grey-text small-text m-0">
                or click to browse files: XLSX · CSV
                <br />
                Maximum file size: 10MB
              </p>
            </div>
            <input
              ref={questionsFileRef}
              type="file"
              accept=".xlsx,.csv"
              hidden
              onChange={(e) => setQuestionsFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="m-0">Content file (optional)</h6>
              <button
                type="button"
                className="btn dsh-btn px-3 d-inline-flex align-items-center gap-1"
                onClick={() => downloadTemplate("content")}
              >
                Download template
              </button>
            </div>
            <p className="grey-text mb-3">
              Upload supporting study content or passages for this exam
            </p>
            <div
              className={`upload-dropzone ${contentDragActive ? "upload-dropzone-active" : ""}`}
              onClick={() => contentFileRef.current?.click()}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, setContentDragActive)}
              onDragLeave={(e) => handleDragLeave(e, setContentDragActive)}
              onDrop={(e) =>
                handleDrop(e, setContentFile, setContentDragActive)
              }
            >
              <span className="upload-dropzone-icon">
                <UploadIcon />
              </span>
              <p className="m-0 fw-medium">
                {contentFile ? contentFile.name : "Drag & drop your file here"}
              </p>
              <p className="grey-text small-text m-0">
                or click to browse files: XLSX · CSV
                <br />
                Maximum file size: 10MB
              </p>
            </div>
            <input
              ref={contentFileRef}
              type="file"
              accept=".xlsx,.csv"
              hidden
              onChange={(e) => setContentFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card-panel p-4">
          <h6>Exam settings</h6>
          <p className="grey-text mb-4">Configure how the exam is delivered</p>

          <div className="row mx-0 g-3 mb-4">
            <div className="col-12 col-md-6 px-0 pe-md-2">
              <label className="form-label">Questions per attempt</label>
              <input
                type="number"
                className="cp-input"
                value={questionsPerAttempt}
                onChange={(e) => setQuestionsPerAttempt(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 px-0 ps-md-2">
              <label className="form-label">Exam duration (Minutes)</label>
              <input
                type="number"
                className="cp-input"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
              />
            </div>
          </div>

          {[
            {
              label: "Shuffle questions",
              desc: "Questions appear in a different order for each student",
              value: shuffleQuestions,
              onChange: setShuffleQuestions,
            },
            {
              label: "Shuffle answer options",
              desc: "Answer choices are randomized per question per student",
              value: shuffleAnswers,
              onChange: setShuffleAnswers,
            },
            {
              label: "Allow retakes",
              desc: "Students can retake the exam after completion",
              value: allowRetakes,
              onChange: setAllowRetakes,
            },
          ].map((setting) => (
            <div
              key={setting.label}
              className="d-flex align-items-center justify-content-between setting-row"
            >
              <div>
                <p className="m-0">{setting.label}</p>
                <p className="grey-text small-text m-0">{setting.desc}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={setting.value}
                  onChange={(e) => setting.onChange(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>
      )}

      {step === 4 && (
        <>
          <div className="card-panel p-4 mb-4">
            <h6>Schedule</h6>
            <p className="grey-text mb-4">Set when the exam opens and closes</p>

            <div className="row mx-0 g-3">
              <div className="col-12 col-md-4 px-0 pe-md-2">
                <label className="form-label">Opening date</label>
                <input
                  type="date"
                  className="cp-input"
                  value={openingDate}
                  onChange={(e) => setOpeningDate(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4 px-0 px-md-2">
                <label className="form-label">Closing date</label>
                <input
                  type="date"
                  className="cp-input"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4 px-0 ps-md-2">
                <label className="form-label">Exam start time</label>
                <input
                  type="time"
                  className="cp-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card-panel p-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h6 className="m-0">Assign students</h6>
              <span className="pts-tag">
                {selectedStudents.length} selected
              </span>
            </div>
            <p className="grey-text mb-3">Choose who can take this exam</p>

            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                type="text"
                className="cp-input flex-fill"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
              <button
                className="btn dsh-btn px-3"
                onClick={() =>
                  setSelectedStudents(filteredStudents.map(studentIdOf))
                }
              >
                Select all
              </button>
              <button
                className="btn dsh-btn px-3"
                onClick={() => setSelectedStudents([])}
              >
                Clear
              </button>
            </div>

            <div className="assign-students-list">
              {isFetchingStudents ? (
                <p className="grey-text py-3 text-center m-0">
                  Searching students...
                </p>
              ) : (
                <>
                  {filteredStudents.map((s) => {
                    const id = studentIdOf(s);
                    return (
                      <label
                        key={id}
                        className="d-flex align-items-center gap-2 assign-student-row"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(id)}
                          onChange={() => toggleStudent(id)}
                        />
                        <span className="avatar-circle">
                          {initialsOf(s.student_name)}
                        </span>
                        <span className="text-capitalize">
                          {s.student_name}
                        </span>
                      </label>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <p className="grey-text py-3 text-center m-0">
                      No students found
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}

      <div className="d-flex gap-2 mt-4">
        {step > 1 && (
          <button
            className="btn secondary-btn py-2 px-4"
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            className="btn default-btn py-2 px-4"
            onClick={() => {
              if (step === 1) commitPendingSubject();
              setStep((s) => s + 1);
            }}
          >
            Continue
          </button>
        ) : (
          <button
            className="btn default-btn py-2 px-4"
            disabled={publishMutation.isPending}
            onClick={() => publishMutation.mutate()}
          >
            {publishMutation.isPending ? "Publishing..." : "Publish exam"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateExam;
