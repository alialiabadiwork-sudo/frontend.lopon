import { httpService } from "@core/http-service";

export const searchService = {
  /**
   * Search vendors, services, and addresses
   * @param {string} query - The search string
   * @param {object} params - Optional params (page, limit)
   * @param {AbortSignal} signal - Optional AbortController signal
   */
  search: (query, params = {}, signal = null) => {
    return httpService.get("search", {
      params: {
        q: query,
        ...params,
      },
      signal,
    });
  },
};

export default searchService;
