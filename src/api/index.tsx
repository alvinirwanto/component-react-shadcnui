import useFetchData from "@/lib/use-fetch-data";

export const useAPI = () => {
    const fetchData = useFetchData();

    const getUsers = async (page: number, limit: number) => fetchData({
        endpoint: `/users?page=${page}&per_page=${limit}`
    })

    return {
        getUsers
    }
}