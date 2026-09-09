// export const generalService ={
//     get: async<T, >(endpoint:string):Promise<T> =>{
//         return await fetch(`http://localhost:4000/${endpoint}`).then(res => res.json())
//     }
// }
export const generalService = {
    get: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`http://localhost:4000${endpoint}`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
    },
};
