import { _formatTimeAgo } from "../../utils/formatTime";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommunityAPI } from "../../api/CommunityAPI";
import { useState } from "react";

const Reply = ({ reply, postId }) => {
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
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

  // Helper to recursively update a reply in a nested structure
  function updateReplyLike(arr, commentId) {
    return arr.map((c) => {
      if (c.name === commentId) {
        return {
          ...c,
          is_liked: c.is_liked === 1 ? 0 : 1,
          like_count:
            c.is_liked === 1
              ? Math.max(0, (c.like_count || 0) - 1)
              : (c.like_count || 0) + 1,
        };
      } else if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: updateReplyLike(c.replies, commentId),
        };
      } else {
        return c;
      }
    });
  }

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
          comments: updateReplyLike(old.comments, commentId),
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

  const toggleReply = (id) => {
    if (replyId === null) {
      setReplyId(id);
    } else {
      setReplyId(null);
      setReplyText("");
    }
  };

  const handleReply = (e) => {
    setReplyText(e.target.value);
  };

  const toggleShowReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <div className="ms-3 mt-3 py-3 row mx-0">
      <div className="d-flex col-2 col-lg-1">
        <img
          src={reply?.user_image || "/assets/cm-placeholder.svg"}
          width={38}
          height={38}
          className="rounded-circle"
        />
      </div>
      <div className="col">
        <div className="">
          <p className="m-0 text-capitalize">
            {reply?.full_name}
            <span className="ms-3 grey-text">
              {_formatTimeAgo(reply?.creation)}
            </span>
          </p>
        </div>
        <p className="m-0 mt-3 mb-3 post-content">{reply?.content}</p>
        <div className="d-flex align-items-center">
          <span
            className="d-flex align-items-center pointer"
            onClick={toggleShowReplies}
          >
            <img src="/assets/comment.svg" style={{ marginRight: "5px" }} />
            {reply?.replies?.length}{" "}
            {reply?.replies?.length > 1 ? "replies" : "reply"}
          </span>
          <span
            className="d-flex align-items-center mx-4 pointer"
            onClick={() => likePost(reply?.name)}
          >
            {reply?.is_liked === 1 ? (
              <ThumbUpAltIcon style={{ marginRight: "5px" }} />
            ) : (
              <ThumbUpOffAltIcon style={{ marginRight: "5px" }} />
            )}
            {reply?.like_count}
          </span>
          <button className="btn m-0" onClick={() => toggleReply(reply?.name)}>
            {replyId === reply?.name ? "Close" : "Reply"}
          </button>
        </div>

        {replyId === reply?.name && (
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
        reply?.replies?.length > 0 &&
        reply?.replies.map((reply) => (
          <Reply key={reply.name} postId={postId} reply={reply} />
        ))}
    </div>
  );
};

export default Reply;
