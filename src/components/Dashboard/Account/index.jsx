import { useState } from "react";
import "./styles.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import LoadingTracker from "../../Common/Loading";
import { useSnackbar } from "notistack";
import Modal from "@mui/material/Modal";
import { AuthAPI } from "../../../api/AuthAPI";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [securityAuth, setSecurityAuth] = useState(false);

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: profile, isFetching } = useQuery({
    queryKey: ["profile"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.getProfile(true),
  });

  const mutation = useMutation({
    mutationFn: ({ name, phone, email }) => {
      setLoading(true);
      const response = DashboardAPI.updateProfile(name, phone, email, true);
      return response;
    },
    onSuccess: () => {
      setLoading(false);
      enqueueSnackbar("Success", {
        autoHideDuration: 3000,
        style: { backgroundColor: "#fff", color: "#0c7a50" },
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      setLoading(false);
      enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
    },
  });

  const validationSchema = Yup.object().shape({
    new_password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    old_password: Yup.string().required("Password is required"),
    c_pwd: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: (details) => AuthAPI.changePassword(details, true),
    onSuccess: () => {
      setChangingPassword(false);
      enqueueSnackbar("Success", {
        autoHideDuration: 3000,
        style: { backgroundColor: "#fff", color: "#0c7a50" },
      });
      reset();
      setShowPasswordModal(false);
    },
    onError: () => {
      setChangingPassword(false);
      enqueueSnackbar("Error updating password", { variant: "error" });
    },
  });

  const changePassword = (data) => {
    setChangingPassword(true);
    changePasswordMutation.mutate({
      old_password: data.old_password,
      new_password: data.new_password,
    });
  };

  const updateProfile = () => {
    mutation.mutate({ name, phone, email });
  };

  if (isFetching) {
    return <LoadingTracker />;
  }

  const orgName = profile?.message?.organization_name;

  return (
    profile && (
      <div>
        <div className="card-panel p-4 mb-4">
          <h6 className="mb-1">Organization Profile</h6>
          <p className="grey-text mb-4">Public information about your school</p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="settings-avatar">
              {(orgName || "A").charAt(0).toUpperCase()}
            </span>
            <button className="btn dsh-btn px-3">Change logo</button>
            <button className="btn p-0 text-decoration-none">Remove</button>
          </div>

          <div className="row mx-0 g-3">
            <div className="col-12 col-md-6 px-0 pe-md-2">
              <label className="form-label">Organization name</label>
              <input
                type="text"
                className="cp-input"
                defaultValue={orgName}
                readOnly
              />
            </div>
            <div className="col-12 col-md-6 px-0 ps-md-2">
              <label className="form-label">Contact email</label>
              <input
                type="email"
                className="cp-input"
                placeholder="contact@organization.com"
                defaultValue={profile?.message?.contact_person_email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 px-0 pe-md-2">
              <label className="form-label">Contact name</label>
              <input
                type="text"
                className="cp-input"
                placeholder="Enter name"
                defaultValue={profile?.message?.contact_person}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 px-0 ps-md-2">
              <label className="form-label">Phone number</label>
              <input
                type="tel"
                className="cp-input"
                placeholder="Phone"
                defaultValue={profile?.message?.contact_number}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn p-0 green-text"
              onClick={() => setShowPasswordModal(true)}
            >
              Change password
            </button>
            <button
              disabled={loading || (!name && !phone && !email)}
              onClick={updateProfile}
              className="btn default-btn py-2 px-4"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        <div className="card-panel">
          <div className="settings-row d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <span className="settings-icon">
                <NotificationsOutlinedIcon fontSize="small" />
              </span>
              <div>
                <p className="m-0">Push notifications</p>
                <p className="grey-text small-text m-0">Streaks, replies &amp; rewards</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="settings-row d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <span className="settings-icon">
                <AccessTimeOutlinedIcon fontSize="small" />
              </span>
              <div>
                <p className="m-0">Weekly performance digest</p>
                <p className="grey-text small-text m-0">Summary every Monday</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="settings-row d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <span className="settings-icon">
                <LockOutlinedIcon fontSize="small" />
              </span>
              <div>
                <p className="m-0">Security &amp; Auth</p>
                <p className="grey-text small-text m-0">Single sign-on, MFA, and access logs</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={securityAuth}
                onChange={(e) => setSecurityAuth(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <a
            href="mailto:support@study-ai.org"
            className="settings-row d-flex align-items-center justify-content-between text-decoration-none text-dark"
          >
            <div className="d-flex align-items-center gap-3">
              <span className="settings-icon">
                <MailOutlineIcon fontSize="small" />
              </span>
              <div>
                <p className="m-0">Help &amp; Support</p>
                <p className="grey-text small-text m-0">Contact our team</p>
              </div>
            </div>
            <ChevronRightIcon className="grey-text" />
          </a>
        </div>

        <Modal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        >
          <div
            className="change-password-bg"
            onClick={() => {
              reset();
              setShowPasswordModal(false);
            }}
          >
            <div
              className="change-password-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h5 className="mb-5">Change password</h5>
              <form onSubmit={handleSubmit(changePassword)}>
                <div className="mb-4">
                  <div className="change-password d-flex justify-content-between form-control form-field">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Old password"
                      className="w-100 me-2"
                      {...register("old_password")}
                    />
                    <div
                      className="pointer"
                      onClick={() => setShowOldPassword((s) => !s)}
                    >
                      {showOldPassword ? (
                        <VisibilityOff sx={{ color: "#929292" }} />
                      ) : (
                        <Visibility sx={{ color: "#929292" }} />
                      )}
                    </div>
                  </div>
                  {errors?.old_password && (
                    <div className="invalid-feedback d-block">
                      {errors.old_password.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="change-password d-flex justify-content-between form-control form-field">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New password"
                      className="w-100 me-2"
                      {...register("new_password")}
                    />
                    <div
                      className="pointer"
                      onClick={() => setShowNewPassword((s) => !s)}
                    >
                      {showNewPassword ? (
                        <VisibilityOff sx={{ color: "#929292" }} />
                      ) : (
                        <Visibility sx={{ color: "#929292" }} />
                      )}
                    </div>
                  </div>
                  {errors?.new_password && (
                    <div className="invalid-feedback d-block">
                      {errors.new_password.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="change-password d-flex justify-content-between form-control form-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-100 me-2"
                      {...register("c_pwd")}
                    />
                    <div
                      className="pointer"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff sx={{ color: "#929292" }} />
                      ) : (
                        <Visibility sx={{ color: "#929292" }} />
                      )}
                    </div>
                  </div>
                  {errors?.c_pwd && (
                    <div className="invalid-feedback d-block">
                      {errors.c_pwd.message}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn secondary-btn py-2"
                    onClick={() => {
                      reset();
                      setShowPasswordModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn default-btn py-2"
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Updating..." : "Update password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    )
  );
};

export default Profile;
