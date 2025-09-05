import { useState } from "react";
import "./styles.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import LoadingTracker from "../../Common/Loading";
import { useSnackbar } from "notistack";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

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

          <div className="mb-4 mt-5">
            <label className="form-label">Organization Name</label>
            <input
              type="text"
              className="pb-2 ps-0 form-control border-0 border-bottom rounded-0 grey-text"
              placeholder="Enter name"
              defaultValue={profile?.message?.organization_name}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="pb-2 ps-0 grey-text form-control border-0 border-bottom rounded-0"
              placeholder="Email"
              defaultValue={profile?.message?.organization_email}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="pb-2 ps-0 grey-text form-control border-0 border-bottom rounded-0"
              placeholder="Physcial Address"
              defaultValue={profile?.message?.physical_address}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="form-label mb-4">Password</label>
            <br />
            <button className="btn secondary-btn py-2">Change password</button>
          </div>

          <h6 className="mt-5 mb-4">Contact person</h6>
          <div className="profile-field p-4">
            <div className="mb-4 mt-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="pb-2 ps-0 form-control border-0 border-bottom rounded-0 grey-text"
                placeholder="Enter name"
                defaultValue={profile?.message?.contact_person}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="pb-2 ps-0 grey-text form-control border-0 border-bottom rounded-0"
                placeholder="Email"
                defaultValue={profile?.message?.contact_person_email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
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
        </div>
      </div>
    )
  );
};

export default Profile;
