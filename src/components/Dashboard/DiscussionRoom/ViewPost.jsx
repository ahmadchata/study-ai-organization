import "./styles.css";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CommunityAPI } from "../../../api/CommunityAPI";
import { _formatTimeAgo, _formatTimestamp } from "../../../utils/formatTime";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Layout from "./Layout";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PostSkeleton from "../../Common/Skeletons/PostSkeleton";
import CommentSkeleton from "../../Common/Skeletons/CommentSkeleton";
import Comment from "../../Common/Comment";

const ViewPost = () => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const textareaRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: post,
    error,
    isFetching,
    isPaused,
  } = useQuery({
    queryKey: ["post"],
    queryFn: () => CommunityAPI.getPost(id, true),
  });

  const { data: comments, isFetching: isFetchingComments } = useQuery({
    queryKey: ["comments"],
    queryFn: () => CommunityAPI.getComments(id, true),
  });

  const commentMutation = useMutation({
    mutationFn: async (comment) => {
      setLoading(true);
      const response = await CommunityAPI.createComment(comment, true);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setComment("");
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      console.log(error);
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await CommunityAPI.likePost(postId, true);
      return response;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post"] });
      const previousData = queryClient.getQueryData(["post"]);

      queryClient.setQueryData(["post"], (old) => {
        if (!old?.post) return old;
        return {
          ...old,
          post: {
            ...old.post,
            is_liked: old.post.is_liked === 1 ? 0 : 1,
            like_count:
              old.post.is_liked === 1
                ? Math.max(0, (old.post.like_count || 0) - 1)
                : (old.post.like_count || 0) + 1,
          },
        };
      });
      return { previousData };
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: (context) => {
      //roll back
      queryClient.setQueryData(["post"], context.previousData);
    },
  });

  const likePost = (postId) => {
    likeMutation.mutate(postId);
  };

  const sendComment = () => {
    if (comment === "") return;
    const commentData = {
      post_id: id,
      content: comment,
    };
    commentMutation.mutate(commentData);
  };

  const goBack = () => {
    navigate("/dashboard/discussion-room");
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const max = 160; // px
    el.style.height = Math.min(el.scrollHeight, max) + "px";
  };

  const handleComment = (e) => {
    setComment(e.target.value);
    autoResize();
  };

  useEffect(() => {
    // Initialize height on mount and when comment is cleared
    autoResize();
  }, [comment]);

  if (error) {
    return (
      <div className="col m-0 p-0">
        <p>There was an error</p>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="col m-0 p-0">
        <p>Check your connection</p>
      </div>
    );
  }

  if (isFetching) {
    return (
      <Layout>
        <PostSkeleton />
      </Layout>
    );
  }

  const {
    user_image,
    title,
    name,
    content,
    full_name,
    community_group_title,
    creation,
    comment_count,
    is_liked,
    like_count,
    view_count,
  } = post.post;

  return (
    <Layout>
      <div className="col row m-0 p-0 post-feed">
        <div className="col-12 p-0 text-decoration-none text-dark">
          <button
            className="d-flex p-0 pb-3 rounded-0 align-items-center btn mb-4 position-sticky top-0 bg-white w-100"
            onClick={goBack}
          >
            <ArrowBackIosIcon style={{ fontSize: "14px" }} /> Back
          </button>
          <div className="d-flex">
            <img
              src={user_image || "/assets/cm-placeholder.svg"}
              width={45}
              height={45}
              className="rounded-circle"
              style={{ objectFit: "cover" }}
            />
            <div className="ms-2">
              <div className="d-flex align-items-center">
                <p className="m-0 text-capitalize me-1 pointer">{full_name}</p>/
                <p className="m-0 text-capitalize ms-1 pointer">
                  {community_group_title}
                </p>
              </div>
              <p className="m-0 grey-text">{_formatTimeAgo(creation)}</p>
            </div>
          </div>
          <h5 className="m-0 mt-4 mb-3 post-title">{title}</h5>
          <div
            className="m-0 mt-4 mb-3 post-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="d-flex align-items-center border-bottom border-2 pb-4 mb-4">
            <span className="d-flex align-items-center pointer">
              <img src="/assets/comment.svg" style={{ marginRight: "5px" }} />
              {comment_count} {comment_count > 1 ? "comments" : "comment"}
            </span>
            <span
              className="d-flex align-items-center mx-4 pointer"
              onClick={() => likePost(name)}
            >
              {is_liked === 1 ? (
                <ThumbUpAltIcon style={{ marginRight: "5px" }} />
              ) : (
                <ThumbUpOffAltIcon style={{ marginRight: "5px" }} />
              )}
              {like_count}
            </span>
            <span
              className="d-flex align-items-center"
              style={{ marginRight: "15px" }}
            >
              {view_count} Views
            </span>
          </div>

          <div
            className={`comment-form ${
              comment?.length < 30 && "d-flex"
            } justify-content-between p-2`}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              className="w-100 me-3"
              placeholder="Write something"
              value={comment}
              onChange={handleComment}
            />
            <button
              disabled={loading || comment === ""}
              onClick={sendComment}
              className="btn cmty-btn py-1 px-3"
            >
              {loading ? "Sending..." : "Comment"}
            </button>
          </div>

          <h5 className="mt-5">Comments</h5>
          <div className="mt-4">
            {isFetchingComments ? (
              <CommentSkeleton />
            ) : (
              comments?.comments?.map((comment) => (
                <Comment key={comment.name} comment={comment} postId={id} />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewPost;
