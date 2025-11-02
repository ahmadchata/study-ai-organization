import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
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
    return <CircularProgress size={"20px"} style={{ color: "#0c7a50" }} />;
  }

  return (
    <div className="login-container">
      <div className="login-form px-4">
        <div className="text-center">
          <img
            className="img-fluid logo"
            src="/assets/logo.svg"
            alt="logo"
            loading="lazy"
          />
          <p className="m-0 p-0 fs-5">
            <span className="text-black">Welcome back, enter your details</span>
          </p>
        </div>

        <div className="row mx-0 px-0 mt-4">
          <div className={`col-6 m-0 p-0 py-2 pe-2`}>
            <div
              className={`selection-card py-3 px-2 pointer d-flex align-items-center`}
              role="button"
              tabIndex={0}
              onClick={() => {
                window.location.href = "https://dashboard.study-ai.org";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.location.href = "https://dashboard.study-ai.org";
                }
              }}
            >
              <div className="flex-fill text-truncate d-flex align-items-center">
                <span>Student</span>
              </div>
              <div>
                <input
                  type="radio"
                  readOnly
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                />
              </div>
            </div>
          </div>

          <div className={`col-6 m-0 p-0 py-2 ps-2`}>
            <div
              className={`selection-card py-3 px-2 pointer d-flex align-items-center selected`}
            >
              <div className="flex-fill text-truncate d-flex align-items-center">
                <span>Organization</span>
              </div>
              <div>
                <input
                  type="radio"
                  checked
                  readOnly
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="row mx-0 mt-2">
          <div className="login mt-4 mb-4 col-12 form-control form-field">
            <input
              disabled={loading}
              type="email"
              className="w-100"
              placeholder="Enter email address"
              {...register("usr")}
            />
            <div className={`${errors.usr ? "is-invalid" : ""}`}></div>

            {errors?.usr && (
              <div className="invalid-feedback">{errors.usr.message}</div>
            )}
          </div>

          <div className={`col-12 px-0`}>
            <div className="login d-flex justify-content-between form-control form-field">
              <input
                disabled={loading}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-100 me-2"
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
            <div className={`${errors.pwd ? "is-invalid" : ""}`}></div>
            {errors?.pwd && (
              <div className="invalid-feedback">{errors.pwd.message}</div>
            )}
          </div>
          {/* <Link to="#" className={`text-dark mt-2`}>
            <label className="text-end pointer w-100">Forgot password?</label>
          </Link> */}
          <button
            disabled={loading}
            className="btn default-btn mt-5 mb-4"
            type="submit"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
