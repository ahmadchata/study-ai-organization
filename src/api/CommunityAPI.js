import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const CommunityAPI = {
  createPost: async function (post, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.create_post`,
      method: "POST",
      data: post,
      signal: cancel
        ? cancelApiObject[this.createPost.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response;
  },

  createCommunity: async function (community, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.create_community`,
      method: "POST",
      data: community,
      signal: cancel
        ? cancelApiObject[this.createCommunity.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response;
  },

  getCommunity: async function (id, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.get_community_details?community_id=${id}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getCommunity.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  getUserCommunities: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.get_user_communities`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[
            this.getUserCommunities.name
          ].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  getCommunityPosts: async function (id, page = 1, limit = 20, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.get_community_posts?community_id=${id}&page=${page}&limit=${limit}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[
            this.getCommunityPosts.name
          ].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  getPosts: async function (page = 1, limit = 20, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.get_user_community_posts?page=${page}&limit=${limit}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getPosts.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  getPost: async function (post_id, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.get_post_details?post_id=${post_id}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getPost.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  likePost: async function (post_id, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.like_post?post_id=${post_id}`,
      method: "POST",
      data: "",
      signal: cancel
        ? cancelApiObject[this.likePost.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  followCommunity: async function (community_id, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.join_community`,
      method: "POST",
      data: community_id,
      signal: cancel
        ? cancelApiObject[this.followCommunity.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  leaveCommunity: async function (community_id, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.leave_community`,
      method: "POST",
      data: community_id,
      signal: cancel
        ? cancelApiObject[this.leaveCommunity.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  getCommunities: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.get_communities`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getCommunities.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  createComment: async function (comment, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.create_comment`,
      method: "POST",
      data: comment,
      signal: cancel
        ? cancelApiObject[this.createComment.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response;
  },

  getComments: async function (post_id, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.get_comments?post_id=${post_id}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getComments.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  likeComment: async function (comment_id, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.like_comment`,
      method: "POST",
      data: comment_id,
      signal: cancel
        ? cancelApiObject[this.likeComment.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  searchCommunity: async function (query, page, limit, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.search_communities?query=${query}&page=${page}&limit=${limit}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.searchCommunity.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  searchAll: async function (query, page, limit, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.search_all?query=${query}&page=${page}&limit=${limit}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.searchAll.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  getUserDetails: async function (email, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.get_user_profile?user_id=${email}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getUserDetails.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  getNotifications: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.get_notifications`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[
            this.getNotifications.name
          ].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  readNotification: async function (notification_id, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.community.mark_notification_read?notification_id=${notification_id}`,
      method: "PUT",
      signal: cancel
        ? cancelApiObject[
            this.readNotification.name
          ].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },
};
const cancelApiObject = defineCancelApiObject(CommunityAPI);
