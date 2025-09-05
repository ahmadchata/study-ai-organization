import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const SubscriptionAPI = {
  getSubscriptionTypes: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.subscription.get_subscription_types`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[
            this.getSubscriptionTypes.name
          ].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },

  subscribe: async function (subscription, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.purchase_subscription`,
      method: "POST",
      data: subscription,
      signal: cancel
        ? cancelApiObject[this.subscribe.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data.data;
  },

  revokeSubscription: async function (subscriptionCode, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization.revoke_subscription`,
      method: "POST",
      data: subscriptionCode,
      signal: cancel
        ? cancelApiObject[
            this.revokeSubscription.name
          ].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.data;
  },
};

const cancelApiObject = defineCancelApiObject(SubscriptionAPI);
