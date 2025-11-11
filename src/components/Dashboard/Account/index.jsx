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

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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
        autoHideDuration: 10000,
        style: {
          backgroundColor: "#fff",
          color: "#0c7a50",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      setLoading(false);
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
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
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: (details) => {
      const response = AuthAPI.changePassword(details, true);
      return response;
    },
    onSuccess: () => {
      setChangingPassword(false);
      enqueueSnackbar("Success", {
        autoHideDuration: 10000,
        style: {
          backgroundColor: "#fff",
          color: "#0c7a50",
        },
      });
      reset();
      setShowPasswordModal(false);
    },
    onError: () => {
      setChangingPassword(false);
      enqueueSnackbar("Error", {
        autoHideDuration: 10000,
        style: {
          backgroundColor: "#fff",
          color: "#0c7a50",
        },
      });
    },
  });

  const changePassword = (data) => {
    const payload = {
      old_password: data.old_password,
      new_password: data.new_password,
    };
    setChangingPassword(true);
    changePasswordMutation.mutate(payload);
  };

  const updateProfile = () => {
    mutation.mutate({ name: name, phone: phone, email: email });
  };

  if (isFetching) {
    return <LoadingTracker />;
  }

  return (
    profile && (
      <div className="py-5">
        <div className="profile-card p-4">
          <div className="d-inline-flex flex-column align-items-center w-100">
            <img
              src="/assets/profile.svg"
              alt="Avatar"
              className="rounded-circle"
              width={99}
              height={92}
            />
            <button className="mt-4 btn edit-profile">Edit Profile</button>
          </div>

          <div className="mb-4 mt-5 form-input">
            <label className="form-label">Organization Name</label>
            <input
              type="text"
              className="pb-2 ps-0 form-control border-0 border-bottom rounded-0 grey-text"
              placeholder="Enter name"
              defaultValue={profile?.message?.organization_name}
              readOnly
            />
          </div>

          <div className="mb-4 form-input">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="pb-2 ps-0 grey-text form-control border-0 border-bottom rounded-0"
              placeholder="Email"
              defaultValue={profile?.message?.organization_email}
              readOnly
            />
          </div>

          <div className="mb-4 form-input">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="pb-2 ps-0 grey-text form-control border-0 border-bottom rounded-0"
              placeholder="Physcial Address"
              defaultValue={profile?.message?.physical_address}
              readOnly
            />
          </div>

          <div className="mb-4 form-input">
            <label className="form-label mb-4">Password</label>
            <br />
            <button
              className="btn secondary-btn py-2"
              onClick={() => setShowPasswordModal(true)}
            >
              Change password
            </button>
          </div>

          <h6 className="mt-5 mb-4">Contact person</h6>
          <div className="profile-field p-4 form-input">
            <div className="mb-4 mt-3 form-input">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="pb-2 ps-0 form-control border-0 border-bottom rounded-0 grey-text"
                placeholder="Enter name"
                defaultValue={profile?.message?.contact_person}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4 form-input">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="pb-2 ps-0 grey-text form-control border-0 border-bottom rounded-0"
                placeholder="Email"
                defaultValue={profile?.message?.contact_person_email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4 form-input">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="pb-2 ps-0 grey-text form-control border-0 border-bottom rounded-0"
                placeholder="Phone"
                defaultValue={profile?.message?.contact_number}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              disabled={loading || (!name && !phone & !email)}
              onClick={updateProfile}
              className="py-2 btn default-btn my-5"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>

          <Modal
            open={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
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
      </div>
    )
  );
};

export default Profile;
