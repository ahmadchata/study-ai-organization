import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const AuthAPI = {
  checkAuth: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.auth.check_auth?type=Organization`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.checkAuth.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response;
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

  changePassword: async function (password, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.auth.reset_password`,
      method: "POST",
      data: password,
      signal: cancel
        ? cancelApiObject[this.changePassword.name].handleRequestCancellation()
            .signal
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

const cancelApiObject = defineCancelApiObject(AuthAPI);
