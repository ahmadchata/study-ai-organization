import Layout from "./Layout";
import "./styles.css";
import { useCallback, useState } from "react";
import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  useMutation,
} from "@tanstack/react-query";
import { CommunityAPI } from "../../../api/CommunityAPI";
import FeedSkeleton from "../../Common/Skeletons/FeedSkeleton";
import { Link } from "react-router-dom";
import { _formatTimeAgo, _formatTimestamp } from "../../../utils/formatTime";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SearchIcon from "@mui/icons-material/Search";
import Select from "../../Common/Select/Select";
import { useAuth } from "../../../Context/AuthContext";

const ViewRoom = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [showNavDiv, setShowNavDiv] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const id = user?.organization_profile?.admin_communities[0]?.name;

  const {
    data: room,
    isFetching: isFetchingRoom,
    error,
  } = useQuery({
    queryKey: ["room", id],
    queryFn: () => CommunityAPI.getCommunity(id, true),
  });

  const queryClient = useQueryClient();

  const options = [
    { value: "All", label: "All" },
    { value: "Latest", label: "Latest" },
  ];

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["communityPosts", id],
      queryFn: ({ pageParam = 1 }) =>
        CommunityAPI.getCommunityPosts(id, pageParam, 20, true),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.posts?.length === 20) {
          return allPages?.length + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;

      // Show nav if scrolled past 160px, hide only when scrolled back to top
      if (scrollTop > 160) {
        setShowNavDiv(true);
      } else if (scrollTop < 50) {
        setShowNavDiv(false);
      }

      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const mutation = useMutation({
    mutationFn: async (postId) => {
      const response = await CommunityAPI.likePost(postId, true);
      return response;
    },
    onMutate: async (postId) => {
      const key = ["communityPosts", id];
      await queryClient.cancelQueries({ queryKey: key });
      const previousData = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) => {
              if (post.name === postId) {
                const isCurrentlyLiked = post.is_liked === 1;
                return {
                  ...post,
                  is_liked: isCurrentlyLiked ? 0 : 1,
                  like_count: isCurrentlyLiked
                    ? Math.max(0, (post.like_count || 0) - 1)
                    : (post.like_count || 0) + 1,
                };
              }
              return post;
            }),
          })),
        };
      });
      return { previousData };
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: (error, postId, context) => {
      // roll back
      const key = ["communityPosts", id];
      if (context?.previousData) {
        queryClient.setQueryData(key, context.previousData);
      }
    },
  });

  const likePost = (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate(postId);
  };

  if (isFetchingRoom) {
    return (
      <Layout>
        <FeedSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p> No room </p>
      </Layout>
    );
  }

  const { title, description, member_count, post_count } = room.community;
  return (
    <Layout id={id} title={title} showNavDiv={showNavDiv}>
      <div className="post-feed" onScroll={handleScroll}>
        <div className="bg-white">
          <div
            className="mb-4 border text-decoration-none text-dark d-flex flex-column justify-content-end"
            style={{ borderRadius: "18px" }}
          >
            <div className="room-bg" style={{ borderRadius: "18px" }}></div>
            <div className="p-3">
              <h5>{title}</h5>
              {/* <p className="grey-text m-0">
                Created by{" "}
                {user?.user?.email === created_by ? "you" : admin_full_name} on{" "}
                {_formatTimestamp(creation)}
              </p> */}
              <div className="d-flex align-items-center my-4">
                <p className="m-0">
                  {member_count} {member_count > 1 ? "members" : "member"}
                </p>
                <p className="m-0 ms-4">
                  {post_count} {post_count > 1 ? "posts" : "post"}
                </p>
              </div>
              <p className="m-0">{description}</p>
            </div>
          </div>

          {!showNavDiv && (
            <div className="d-block d-lg-flex justify-content-between align-items-center">
              <div style={{ width: "133px", height: "40px" }}>
                <Select
                  options={options}
                  value={filter}
                  onChange={setFilter}
                  placeholder="Select Options"
                  className="py-2 bg-white w-100"
                />
              </div>

              <div
                className={`search-container mt-4 mt-lg-0`}
                style={{ backgroundColor: "#F4F4F4" }}
              >
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  className="search-input-1"
                  placeholder="Search room"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="row gap-4 m-0 p-0 mt-4">
          {isFetching
            ? Array.from({ length: 3 }).map((_, i) => <FeedSkeleton key={i} />)
            : allPosts?.map((post) => (
                <Link
                  key={post?.name}
                  to={`/dashboard/discussion-room/post/${post?.name}`}
                  className="col-12 border p-3 text-decoration-none text-dark"
                  style={{ borderRadius: "18px" }}
                >
                  <div className="d-flex">
                    <img
                      src={post?.user_image || "/assets/cm-placeholder.svg"}
                      width={38}
                      height={38}
                      className="rounded-circle"
                    />
                    <div className="ms-2">
                      <p className="m-0 text-capitalize">{post?.full_name}</p>
                      <p className="m-0 grey-text">
                        {_formatTimeAgo(post?.creation)}
                      </p>
                    </div>
                  </div>
                  <h5 className="m-0 mt-4 mb-3 post-title">{post?.title}</h5>
                  <div
                    className="d-none d-lg-block m-0 mt-4 mb-3 post-content"
                    dangerouslySetInnerHTML={{ __html: post?.content }}
                  />
                  <div className="d-flex align-items-center">
                    <span className="d-flex align-items-center pointer">
                      <img
                        src="/assets/comment.svg"
                        style={{ marginRight: "5px" }}
                      />
                      {post?.comment_count}{" "}
                      {post?.comment_count > 1 ? "comments" : "comment"}
                    </span>
                    <span
                      className="d-flex align-items-center mx-4 pointer"
                      onClick={(e) => likePost(e, post?.name)}
                    >
                      {post?.is_liked === 1 ? (
                        <ThumbUpAltIcon style={{ marginRight: "5px" }} />
                      ) : (
                        <ThumbUpOffAltIcon style={{ marginRight: "5px" }} />
                      )}
                      {post?.like_count}
                    </span>
                  </div>
                </Link>
              ))}
          {isFetchingNextPage && (
            <div className="col-12 text-center py-3">
              <p>Loading more posts...</p>
            </div>
          )}

          {!hasNextPage && allPosts.length > 0 && (
            <div className="col-12 text-center py-3">
              <p className="text-muted">No more posts to load</p>
            </div>
          )}

          {allPosts?.length === 0 && <p>No posts</p>}
        </div>
      </div>
    </Layout>
  );
};

export default ViewRoom;
