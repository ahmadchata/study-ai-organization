import Layout from "./Layout";
import { CommunityAPI } from "../../../api/CommunityAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { Link } from "react-router-dom";

const Notifications = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isPaused } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => CommunityAPI.getNotifications(true),
  });

  const readNotificationMutation = useMutation({
    mutationFn: (notificationId) =>
      CommunityAPI.readNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const handleNotificationClick = (notificationId) => {
    readNotificationMutation.mutate(notificationId);
  };

  const renderIcon = (post_type) => {
    const icons = {
      post_liked: <FavoriteIcon style={{ color: "red", fontSize: 30 }} />,
      new_post: <AddCommentIcon style={{ color: "#FF928B", fontSize: 30 }} />,
      new_comment: <CommentIcon style={{ color: "#FFBE3D", fontSize: 30 }} />,
      comment_liked: <FavoriteIcon style={{ color: "red", fontSize: 30 }} />,
    };

    return icons[post_type];
  };

  if (isPaused) {
    return (
      <div className="col">
        <p>Check your connection</p>
      </div>
    );
  }

  if (notifications?.length === 0) {
    return (
      <div className="col">
        <p>No notification</p>
      </div>
    );
  }

  return (
    <Layout>
      <header className="m-0 p-0 community-content_header">
        <h6 className="m-0 py-2">Notifications</h6>
      </header>
      <div className="col m-0 p-0">
        {notifications?.notifications?.map((notification) => (
          <Link
            key={notification?.name}
            className={`col-12 border-bottom text-decoration-none py-3 text-dark d-flex align-items-center`}
            to={`/dashboard/discussion-room/post/${notification?.link}`}
            onClick={() => handleNotificationClick(notification?.name)}
          >
            {renderIcon(notification.type)}
            <div className="col p-0 ms-2">
              <div className="d-flex align-items-center">
                <img
                  src={notification?.user_image || "/assets/cm-placeholder.svg"}
                  width={45}
                  height={45}
                  className="rounded-circle"
                />
                <div className="ms-2">
                  <p className="m-0 p-0">{notification?.title}</p>
                  <p className="m-0 mt-2 grey-text">{notification?.message}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Notifications;
