import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../Context/AuthContext";
import "./Login.css";
import { useSnackbar } from "notistack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthAPI } from "../../api/AuthAPI";
import CircularProgress from "@mui/material/CircularProgress";

export default function Login() {
  const { login, authenticated, loading: authLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("token");
  const hasVerified = useRef(false);

  const handleClickShowPassword = () =>
    setShowPassword((showPassword) => !showPassword);

  const verifyEmailMutation = useMutation({
    mutationFn: async (token) => {
      const response = await AuthAPI.verifyAccount(token, true);
      return response;
    },
    onSuccess: (response) => {
      enqueueSnackbar(response?.data?.message, {
        variant: "success",
      });
    },
    onError: (error) => {
      setLoading(false);
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
    },
  });

  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard");
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    if (paramValue && !hasVerified.current) {
      hasVerified.current = true;
      verifyEmailMutation.mutate({ token: paramValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramValue]);

  const validationSchema = Yup.object().shape({
    usr: Yup.string().required("Email is required"),
    pwd: Yup.string()
      .min(3, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const mutation = useMutation({
    mutationFn: async ({ usr, pwd }) => {
      setLoading(true);
      const response = await login(usr, pwd);
      return response;
    },
    onSuccess: () => {
      setLoading(false);
      navigate("/dashboard");
    },
    onError: (error) => {
      setLoading(false);
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate({ usr: data.usr, pwd: data.pwd });
  };

  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <CircularProgress size={"20px"} style={{ color: "#0c7a50" }} />
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-visual d-none d-lg-flex">
        <img
          className="login-visual-logo"
          src="/assets/logo-black.png"
          alt="StudyAI"
        />
        <div className="login-visual-illustration">
          <img src="/assets/analyze-data.png" alt="" className="img-fluid" />
        </div>
      </div>

      <div className="login-panel d-flex align-items-center justify-content-center">
        <div className="login-panel-inner">
          <div className="login-toggle">
            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => {
                window.location.href = "https://dashboard.study-ai.org";
              }}
            >
              Student
            </button>
            <button
              type="button"
              className="login-toggle-btn login-toggle-btn-active"
            >
              Organization
            </button>
          </div>

          <h2 className="login-title">Welcome back</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="login-label">Email</label>
              <input
                disabled={loading}
                type="email"
                className="login-input"
                placeholder="Enter your registered email"
                {...register("usr")}
              />
              {errors?.usr && (
                <div className="invalid-feedback d-block">
                  {errors.usr.message}
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className="login-label">Password</label>
              <div className="login-input d-flex align-items-center justify-content-between">
                <input
                  disabled={loading}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-100 me-2 login-input-bare"
                  {...register("pwd")}
                />
                <div className="pointer" onClick={handleClickShowPassword}>
                  {showPassword ? (
                    <VisibilityOff sx={{ color: "#929292" }} />
                  ) : (
                    <Visibility sx={{ color: "#929292" }} />
                  )}
                </div>
              </div>
              {errors?.pwd && (
                <div className="invalid-feedback d-block">
                  {errors.pwd.message}
                </div>
              )}
            </div>

            <button
              disabled={loading}
              className="btn login-submit"
              type="submit"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
