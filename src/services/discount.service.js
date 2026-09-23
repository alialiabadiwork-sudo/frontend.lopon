import { httpsInterceptedService } from "@core/http-service";

export const discountService = {
  validateDiscountCode: (data) => httpsInterceptedService.post("discount-codes/validate", data),
};
