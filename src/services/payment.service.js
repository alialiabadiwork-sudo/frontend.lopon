import { httpsInterceptedService } from "@core/http-service";

export const paymentService = {
  getPayments: () => httpsInterceptedService.get("users/payments"),
  createPayment: (data) => httpsInterceptedService.post("payments", data),
};
