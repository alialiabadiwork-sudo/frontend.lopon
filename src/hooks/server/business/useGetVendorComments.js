import { useQuery } from "@tanstack/react-query";
import { commentService } from "../../../services/comment.service";

/**
 * Hook to fetch vendor comments list by vendor ID from GET /api/v1/comments/vendor/{vendorId}
 */
export const useGetVendorComments = (vendorId) => {
  return useQuery({
    queryKey: ["vendorComments", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const res = await commentService.getVendorComments(vendorId);
      const comments = res?.data?.data || res?.data || [];
      return Array.isArray(comments) ? comments : [];
    },
    enabled: Boolean(vendorId),
    staleTime: 60 * 1000,
    retry: 1,
  });
};

export default useGetVendorComments;
