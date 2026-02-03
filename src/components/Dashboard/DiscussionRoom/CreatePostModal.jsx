import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { CommunityAPI } from "../../../api/CommunityAPI";
import { enqueueSnackbar } from "notistack";
import SuccessSnackbar from "../../Common/Toast/SuccessSnackBar";
import ErrorSnackbar from "../../Common/Toast/ErrorSnackBar";

const CreatePostModal = ({ isOpen, onClose, communityId }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (postData) => CommunityAPI.createPost(postData),
    onSuccess: () => {
      setTitle("");
      setBody("");
      onClose();
      enqueueSnackbar("", {
        content: (key) => (
          <SuccessSnackbar
            id={key}
            message={{
              title: "Success",
              text: "Your post is live",
            }}
          />
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      enqueueSnackbar("", {
        content: (key) => (
          <ErrorSnackbar
            id={key}
            message={{
              title: "Error",
              text: "There was an error sending your post",
            }}
          />
        ),
      });
    },
  });

  const handleCreatePost = () => {
    if (!title.trim() || !body.trim()) {
      enqueueSnackbar("", {
        content: (key) => (
          <ErrorSnackbar
            id={key}
            message={{
              title: "Error",
              text: "Please fill in both title and body",
            }}
          />
        ),
      });
      return;
    }

    createPostMutation.mutate({
      title: title.trim(),
      content: body.trim(),
      community_id: communityId,
    });
  };

  const handleClose = () => {
    setTitle("");
    setBody("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>What will you like to post?</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
          >
            <CloseIcon />
          </button>
        </div>
        <label className="modal-desc">
          Only students registered under your organization will see this post
        </label>

        <div className="modal-body">
          <div className="form-group mt-4">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter your post title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 150))}
              maxLength={150}
              className="form-input"
            />
            <span className="char-count">{title.length}/150</span>
          </div>

          <div className="form-group">
            <label htmlFor="body">Body Text</label>
            <ReactQuill
              value={body}
              onChange={(content) => {
                const plainText = content.replace(/<[^>]*>/g, "");
                if (plainText.length <= 600) {
                  setBody(content);
                }
              }}
              placeholder="Enter body text..."
              className="editor"
            />
            <span className="char-count">
              {body.replace(/<[^>]*>/g, "").length}/600
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-post"
            onClick={handleCreatePost}
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
