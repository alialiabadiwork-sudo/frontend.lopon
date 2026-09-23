import { useQuery } from "@tanstack/react-query";
import { getCarouselByOrder, mapCarouselResponse } from "../../../services/carousel.service";
import { DEALS } from "@core/constants";

const DEFAULT_TITLES = {
  1: "تخفیف‌های ویژه امروز",
  2: "محبوب‌ترین سالن‌های زیبایی",
  3: "خدمات مراقبت از پوست و مو",
  4: "پیشنهادات شگفت‌انگیز",
};

const getFallbackDeals = (orderId) => {
  const num = Number(orderId) || 1;
  const start = ((num - 1) * 4) % (DEALS.length || 1);
  const sliced = DEALS.slice(start, start + 4);
  return sliced.length > 0 ? sliced : DEALS.slice(0, 4);
};

/**
 * Hook to fetch carousel data by order ID.
 * @param {number|string} orderId - The carousel order number (e.g. 1, 2, 3)
 * @param {string} fallbackTitle - Fallback section title if not provided by API
 */
export const useGetCarousel = (orderId, fallbackTitle = "") => {
  const defaultTitle = fallbackTitle || DEFAULT_TITLES[orderId] || "پیشنهادات ویژه";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["carousel", orderId],
    queryFn: async () => {
      try {
        const res = await getCarouselByOrder(orderId);
        return res.data;
      } catch (err) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const mapped = mapCarouselResponse(data, defaultTitle);
  const deals = mapped.deals && mapped.deals.length > 0 ? mapped.deals : getFallbackDeals(orderId);

  return {
    title: mapped.title || defaultTitle,
    deals,
    isLoading: isLoading && !data,
    isError,
    refetch,
  };
};

export default useGetCarousel;
