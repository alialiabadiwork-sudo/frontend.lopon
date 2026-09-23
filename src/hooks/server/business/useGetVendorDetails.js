import { useQuery } from "@tanstack/react-query";
import { businessService } from "../../../services/business.service";

const EMPTY_ARRAY = [];

/**
 * Hook to fetch vendor details by vendor ID.
 * GET /api/v1/vendors/details/{id}
 */
export const useGetVendorDetails = (vendorId) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vendorDetails", vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      const res = await businessService.getVendorDetails(vendorId);
      return res.data;
    },
    enabled: Boolean(vendorId),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  const rawData = data?.data || data;

  const vendor = rawData?.vendor || null;
  // Verify that vendor data matches the requested vendorId to prevent stale state bleed
  const isMatchingVendor = Boolean(
    vendor &&
      vendorId &&
      (String(vendor._id) === String(vendorId) || String(vendor.id) === String(vendorId))
  );

  const safeVendor = isMatchingVendor ? vendor : null;
  const vendorServices = isMatchingVendor ? (rawData?.vendorServices || EMPTY_ARRAY) : EMPTY_ARRAY;
  const rating = isMatchingVendor ? (rawData?.rating ?? vendor?.rating ?? 4.8) : 4.8;
  const commentsCount = isMatchingVendor ? (rawData?.commentsCount ?? 0) : 0;
  const recentComments = isMatchingVendor ? (rawData?.recentComments || EMPTY_ARRAY) : EMPTY_ARRAY;
  const actuallyLoading = isLoading || (Boolean(vendorId) && !isMatchingVendor && !isError);

  return {
    data: isMatchingVendor ? rawData : null,
    vendor: safeVendor,
    vendorServices,
    rating,
    commentsCount,
    recentComments,
    isLoading: actuallyLoading,
    isError,
    error,
    refetch,
  };
};

export default useGetVendorDetails;
