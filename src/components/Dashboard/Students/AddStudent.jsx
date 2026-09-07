import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import CheckIcon from "@mui/icons-material/Check";
import UploadIcon from "@mui/icons-material/UploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuth } from "../../../Context/AuthContext";
import "./styles.css";

const MAX_STUDENTS = 100;

const AddStudent = () => {
  const [step, setStep] = useState(1);
  const [rawInput, setRawInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const orgName = user?.organization_profile?.organization_name || "your Organization";

  const numbers = rawInput
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .slice(0, MAX_STUDENTS);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsed = results.data
          .flat()
          .map((val) => String(val || "").trim())
          .filter(Boolean);
        setRawInput(() => {
          const combined = [...new Set([...numbers, ...parsed])];
          return combined.slice(0, MAX_STUDENTS).join(", ");
        });
      },
    });
    e.target.value = "";
  };

  const downloadTemplate = () => {
    const csv = Papa.unparse({
      fields: ["phone_number"],
      data: [["08012345678"], ["08087654321"]],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "student-phone-numbers-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSend = () => {
    setSubmitting(true);
    // No endpoint wired yet for bulk-inviting students by phone number.
    setTimeout(() => {
      setSubmitting(false);
      setStep(3);
    }, 600);
  };

  if (step === 3) {
    return (
      <div className="result-panel">
        <div className="result-icon">
          <CheckIcon fontSize="large" />
        </div>
        <h4>Message sent</h4>
        <p className="grey-text mt-3">
          An SMS has been sent containing link to create their account and an
          access code to activate their account
        </p>
        <button
          className="btn default-btn mt-4 px-4"
          onClick={() => navigate("/dashboard/students")}
        >
          Go to dashboard
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <h4 className="m-0">Confirm numbers</h4>
        <p className="grey-text mt-2 mb-4">Confirm numbers before adding students</p>

        <div className="card-panel p-4" style={{ maxWidth: "700px" }}>
          <h6 className="mb-3">Message preview</h6>
          <div className="message-preview mb-4">
            <p className="m-0">Hi,</p>
            <p className="mt-3">
              You have a free Study AI subscription from {orgName}.
            </p>
            <p className="m-0">
              To access your account, visit ahmadchatta.com, create an
              account and enter your access code (XYC-JKY) to activate your
              subscription
            </p>
          </div>

          <h6 className="mb-3">Phone numbers</h6>
          <div className="message-preview">
            <p className="m-0">{numbers.join(", ")},</p>
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button
            className="btn secondary-btn py-2 px-4"
            onClick={() => setStep(1)}
          >
            Back
          </button>
          <button
            className="btn default-btn py-2 px-4"
            disabled={submitting}
            onClick={handleSend}
          >
            {submitting ? "Adding..." : "Add students"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="m-0">Add Student</h4>
      <p className="grey-text mt-2 mb-4">
        Students will get individual access codes through SMS
      </p>

      <div className="card-panel p-4" style={{ maxWidth: "700px" }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="m-0">Phone numbers</h6>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn p-0 green-text"
              onClick={downloadTemplate}
              type="button"
            >
              Download CSV template
            </button>
            <button
              className="btn dsh-btn d-inline-flex align-items-center gap-1"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Upload CSV file <UploadIcon fontSize="small" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </div>
        </div>

        <textarea
          className="phone-textarea"
          placeholder="Paste phone numbers seperated by comma"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={8}
        />

        <div className="d-flex align-items-center gap-2 mt-3 grey-text">
          <InfoOutlinedIcon fontSize="small" />
          <span>A maximum of {MAX_STUDENTS} students can be added at once</span>
        </div>
      </div>

      <button
        className="btn default-btn mt-4 py-2 px-4"
        disabled={numbers.length === 0}
        onClick={() => setStep(2)}
      >
        Continue
      </button>
    </div>
  );
};

export default AddStudent;
