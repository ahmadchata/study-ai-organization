import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { CommunityAPI } from "../../../api/CommunityAPI";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "../../../Context/AuthContext";
import "./styles.css";

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
  ],
};

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const communityId = user?.organization_profile?.admin_communities?.[0]?.name;
  const communityTitle =
    user?.organization_profile?.admin_communities?.[0]?.title || "Community";

  const createPostMutation = useMutation({
    mutationFn: (postData) => CommunityAPI.createPost(postData),
    onSuccess: () => {
      enqueueSnackbar("Your post is live", {
        variant: "success",
        style: { backgroundColor: "#fff", color: "#0c7a50" },
      });
      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      navigate("/dashboard/discussion-room");
    },
    onError: () => {
      enqueueSnackbar("There was an error sending your post", {
        variant: "error",
      });
    },
  });

  const handlePost = () => {
    if (!title.trim()) {
      enqueueSnackbar("Please enter a title for your post", {
        variant: "error",
      });
      return;
    }

    createPostMutation.mutate({
      title: title.trim(),
      content: body.trim(),
      community_id: communityId,
    });
  };

  return (
    <div>
      <h4 className="mb-4">What would you like to post?</h4>

      <div className="mb-4" style={{ maxWidth: "700px" }}>
        <label className="form-label">Title</label>
        <input
          type="text"
          className="cp-input"
          placeholder="Enter title for your post"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 150))}
        />
      </div>

      <div className="mb-4" style={{ maxWidth: "700px" }}>
        <label className="form-label">Body Text (optional)</label>
        <ReactQuill
          value={body}
          onChange={setBody}
          placeholder="Enter body text for your post"
          modules={quillModules}
          className="editor"
        />
      </div>

      <div className="mb-5" style={{ maxWidth: "700px" }}>
        <label className="form-label">Select discussion room</label>
        <select className="cp-input" disabled defaultValue={communityId}>
          <option value={communityId}>{communityTitle}</option>
        </select>
      </div>

      <div className="d-flex gap-2" style={{ maxWidth: "700px" }}>
        <button
          className="btn secondary-btn py-2 px-4"
          onClick={() => navigate("/dashboard/discussion-room")}
        >
          Cancel
        </button>
        <button
          className="btn default-btn py-2 px-4"
          disabled={createPostMutation.isPending}
          onClick={handlePost}
        >
          {createPostMutation.isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
