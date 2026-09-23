import { useQuery } from "@tanstack/react-query"
import { httpsInterceptedService } from "@core/http-service"

const useGet = (params, url, key , paginate) => {

    const ParamsUrl = (queryKey) => {
        const entries = Object.entries(params);
        let urlPathParam = '?'

        entries.forEach(([key, value], i) => {
            if (value !== undefined && value !== null) { 
                if (i === 0) {
                    urlPathParam += `${key}=${queryKey[1][key]}`
                } else {
                    urlPathParam += `&${key}=${queryKey[1][key]}`
                }
            }
        })
        return urlPathParam
    }


    const { data, isPending, isError , isLoading , isPaused , refetch } = useQuery({
        queryKey: [key, params],
        queryFn: async ({ queryKey }) => {
            const res = await httpsInterceptedService.get(`/${url}${ParamsUrl(queryKey)}`)
            return res.data
        }
    })

    return {
        data,
        isLoading,
        isPending,
        isError,
        isPaused,
        refetch
    }
}

export default useGet;


// use :
// const {data, loading, error} = useGet(ParmsGetAllServiece, server.url, `${server.url}_Get`)