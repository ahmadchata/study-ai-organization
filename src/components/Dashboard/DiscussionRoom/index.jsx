import Layout from "./Layout";
import "./styles.css";
import { useCallback } from "react";
import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { CommunityAPI } from "../../../api/CommunityAPI";
import FeedSkeleton from "../../Common/Skeletons/FeedSkeleton";
import { Link } from "react-router-dom";
import { _formatTimeAgo } from "../../../utils/formatTime";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CampaignIcon from "@mui/icons-material/Campaign";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../../Context/AuthContext";

const ANNOUNCEMENTS = [
  {
    title: "JAMB Mock Exam Reminder",
    date: "May 2",
    text: "The JAMB mock exam will begin on Friday by 10:00 AM.",
  },
  {
    title: "Stay Consistent",
    date: "Apr 12",
    text: "All students should complete at least 2 lessons daily to get free monthly sub",
  },
  {
    title: "Top Performers This Week",
    date: "Apr 6",
    text: "Congratulations to the students who made it into this week's top 10",
  },
  {
    title: "Welcome Students",
    date: "Apr 1",
    text: "We're excited to have you here. Get ready to learn smarter, stay consistent",
  },
];

const ViewRoom = () => {
  const { user } = useAuth();
  const id = user?.organization_profile?.admin_communities?.[0]?.name;

  const {
    data: room,
    isFetching: isFetchingRoom,
    error,
  } = useQuery({
    queryKey: ["room", id],
    queryFn: () => CommunityAPI.getCommunity(id, true),
  });

  const queryClient = useQueryClient();

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
    onError: (error, postId, context) => {
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
        <p>No community found</p>
      </Layout>
    );
  }

  const { title, description, member_count, post_count } = room.community;

  return (
    <Layout>
      <div className="community-hero d-flex align-items-center justify-content-between">
        <div>
          <h4 className="mb-2">{title}</h4>
          <p className="community-hero-text m-0">
            {description ||
              "Share announcements, manage discussions, organize study groups, and keep students connected in one central community space."}
          </p>
        </div>
        <CampaignIcon className="community-hero-icon d-none d-md-block" />
      </div>

      <div className="d-flex align-items-center justify-content-between mt-4 mb-3 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-4">
          <span>
            Students - <strong>{member_count}</strong>
          </span>
          <span>
            Post - <strong>{post_count}</strong>
          </span>
        </div>
        <Link to="/dashboard/discussion-room/create-post" className="text-decoration-none">
          <button className="btn default-btn d-inline-flex align-items-center gap-1 px-3">
            <AddIcon fontSize="small" /> Create post
          </button>
        </Link>
      </div>

      <div className="row mx-0 g-3">
        <div className="col-12 col-lg-8 px-0 pe-lg-3">
          <div className="post-feed" onScroll={handleScroll}>
            {isFetching
              ? Array.from({ length: 3 }).map((_, i) => <FeedSkeleton key={i} />)
              : allPosts?.map((post) => (
                  <Link
                    key={post?.name}
                    to={`/dashboard/discussion-room/post/${post?.name}`}
                    className="community-post-card d-block text-decoration-none text-dark mb-3"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="avatar-circle">
                          {(post?.full_name || "?").slice(0, 2).toUpperCase()}
                        </span>
                        <div className="ms-2">
                          <span className="text-capitalize fw-medium">
                            {post?.full_name}
                          </span>
                          <span className="grey-text">
                            {" "}
                            · {post?.community_group_title || "General"} ·{" "}
                            {_formatTimeAgo(post?.creation)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <h6 className="mt-3 mb-2">{post?.title}</h6>
                    <div
                      className="post-excerpt grey-text"
                      dangerouslySetInnerHTML={{ __html: post?.content }}
                    />
                    <div className="d-flex align-items-center gap-4 mt-3">
                      <span
                        className="d-flex align-items-center gap-1 pointer"
                        onClick={(e) => likePost(e, post?.name)}
                      >
                        {post?.is_liked === 1 ? (
                          <ThumbUpAltIcon fontSize="small" />
                        ) : (
                          <ThumbUpOffAltIcon fontSize="small" />
                        )}
                        {post?.like_count}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <ChatBubbleOutlineIcon fontSize="small" />
                        {post?.comment_count}
                      </span>
                    </div>
                  </Link>
                ))}

            {isFetchingNextPage && (
              <div className="text-center py-3">
                <p className="grey-text">Loading more posts...</p>
              </div>
            )}

            {allPosts?.length === 0 && !isFetching && (
              <p className="grey-text text-center py-4">No posts yet</p>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4 px-0 ps-lg-3">
          <div className="card-panel p-3 p-lg-4">
            <h6 className="mb-3">Recent Announcements</h6>
            <div className="d-flex flex-column gap-3">
              {ANNOUNCEMENTS.map((a) => (
                <div key={a.title} className="d-flex gap-2 announcement-row">
                  <CampaignIcon className="announcement-icon" fontSize="small" />
                  <div className="flex-fill">
                    <div className="d-flex justify-content-between">
                      <span className="fw-medium">{a.title}</span>
                      <span className="grey-text small-text">{a.date}</span>
                    </div>
                    <p className="grey-text m-0 mt-1 small-text">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewRoom;
