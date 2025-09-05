import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const DashboardAPI = {
  getSubscriptions: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.get_subscriptions`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[
            this.getSubscriptions.name
          ].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  getStudents: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.get_organization_students`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getStudents.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  login: async function (user, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.login`,
      method: "POST",
      data: user,
      signal: cancel
        ? cancelApiObject[this.login.name].handleRequestCancellation().signal
        : undefined,
    });
    return response.data;
  },

  delete: async function (email, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.auth.logout`,
      method: "POST",
      data: email,
      signal: cancel
        ? cancelApiObject[this.delete.name].handleRequestCancellation().signal
        : undefined,
    });
    return response;
  },
};

const cancelApiObject = defineCancelApiObject(DashboardAPI);
