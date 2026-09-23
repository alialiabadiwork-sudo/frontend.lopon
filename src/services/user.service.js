import { httpsInterceptedService } from "@core/http-service";

export const userService = {
  getProfile: () => httpsInterceptedService.get("users/profile"),
  getMe: () => httpsInterceptedService.get("users/getMe"),
  updateProfile: (data) => httpsInterceptedService.put("users/profile", data),
  updateMe: (data) => httpsInterceptedService.post("users/updateMe", data),
  getUserBooks: () => httpsInterceptedService.get("users/books"),
  getUserPayments: () => httpsInterceptedService.get("users/payments"),
};
