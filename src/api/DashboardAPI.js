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

  updateProfile: async function (name, phone, email, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.update_organization_profile?contact_person=${name}&contact_number=${phone}&contact_person_email=${email}`,
      method: "PUT",
      signal: cancel
        ? cancelApiObject[this.updateProfile.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  overview: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.get_organization_overview`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.overview.name].handleRequestCancellation().signal
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

  getProfile: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.get_organization_profile`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getProfile.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data;
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
