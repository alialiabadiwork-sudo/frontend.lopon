import { httpService } from "@core/http-service";

export const businessService = {
  getVendorDetails: (id) => httpService.get(`vendors/details/${id}`),
  getBusinessById: (id) => httpService.get(`vendors/details/${id}`),
  getBusinesses: (params) => httpService.get("vendors", { params }),
};

