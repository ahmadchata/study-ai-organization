import { _formatTimeAgo } from "../../utils/formatTime";
import Reply from "./Reply";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommunityAPI } from "../../api/CommunityAPI";

const Comment = ({ comment, postId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();

  const replyMutation = useMutation({
    mutationFn: async (comment) => {
      setLoading(true);
      const response = await CommunityAPI.createComment(comment, true);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setReplyText("");
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      console.log(error);
    },
  });

  const handleReply = (e) => {
    setReplyText(e.target.value);
  };

  const toggleReply = (id) => {
    if (replyId === null) {
      setReplyId(id);
    } else {
      setReplyId(null);
      setReplyText("");
    }
  };

  const likeMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await CommunityAPI.likeComment(
        {
          comment_id: commentId,
        },
        true,
      );
      return response;
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const previousData = queryClient.getQueryData(["comments"]);

      queryClient.setQueryData(["comments"], (old) => {
        if (!old?.comments) return old;
        return {
          ...old,
          comments: old.comments.map((c) =>
            c.name === commentId
              ? {
                  ...c,
                  is_liked: c.is_liked === 1 ? 0 : 1,
                  like_count:
                    c.is_liked === 1
                      ? Math.max(0, (c.like_count || 0) - 1)
                      : (c.like_count || 0) + 1,
                }
              : c,
          ),
        };
      });
      return { previousData };
    },
    onError: (context) => {
      queryClient.setQueryData(["comments"], context.previousData);
    },
  });

  const likePost = (commentId) => {
    likeMutation.mutate(commentId);
  };

  const sendReply = () => {
    if (replyText === "") return;
    const replyData = {
      post_id: postId,
      content: replyText,
      parent_comment: replyId,
    };
    replyMutation.mutate(replyData);
  };

  const toggleShowReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <div className="border-bottom border-1 py-3 row mx-0 overflow-hidden">
      <div className="d-flex col-2 col-lg-1">
        <img
          src={comment?.user_image || "/assets/cm-placeholder.svg"}
          width={45}
          height={45}
          className="rounded-circle"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="col">
        <div className="">
          <p className="m-0">
            {comment?.full_name}
            <span className="ms-3 grey-text">
              {_formatTimeAgo(comment?.creation)}
            </span>
          </p>
        </div>
        <p className="m-0 mt-3 mb-3 post-content">{comment?.content}</p>
        <div className="d-flex align-items-center">
          <span
            className="d-flex align-items-center pointer"
            onClick={toggleShowReplies}
          >
            <img src="/assets/comment.svg" style={{ marginRight: "5px" }} />
            {comment?.replies?.length}{" "}
            {comment?.replies?.length > 1 ? "replies" : "reply"}
          </span>
          <span
            className="d-flex align-items-center mx-4 pointer"
            onClick={() => likePost(comment?.name)}
          >
            {comment?.is_liked === 1 ? (
              <ThumbUpAltIcon style={{ marginRight: "5px" }} />
            ) : (
              <ThumbUpOffAltIcon style={{ marginRight: "5px" }} />
            )}
            {comment?.like_count}
          </span>
          <button
            className="btn m-0"
            onClick={() => toggleReply(comment?.name)}
          >
            {replyId === comment?.name ? "Close" : "Reply"}
          </button>
        </div>

        {replyId === comment?.name && (
          <div className="comment-form d-flex justify-content-between p-2 mt-2">
            <input
              className="w-100 me-3"
              placeholder="Type reply"
              value={replyText}
              onChange={handleReply}
            />
            <button
              disabled={loading || replyText === ""}
              onClick={sendReply}
              className="btn cmty-btn py-0 px-3"
            >
              {loading ? "Replying..." : "Reply"}
            </button>
          </div>
        )}
      </div>
      {showReplies &&
        comment?.replies?.length > 0 &&
        comment?.replies.map((reply) => (
          <Reply key={reply.name} postId={postId} reply={reply} />
        ))}
    </div>
  );
};

export default Comment;
