import { httpService, httpsInterceptedService } from "@core/http-service";

export const commentService = {
  getVendorComments: (vendorId) => httpService.get(`comments/vendor/${vendorId}`),
  getComments: (params) => httpService.get("comments", { params }),
  createComment: (data) => httpsInterceptedService.post("comments", data),
};
