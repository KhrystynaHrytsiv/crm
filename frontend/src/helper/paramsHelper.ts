import {useRouter, useSearchParams} from "next/navigation";
const router = useRouter();
const searchParams = useSearchParams();

export const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
        params.set(key, value);
    } else {
        params.delete(key);
    }
    router.push(`/orders?${params.toString()}`);
};
export const handleSort = async(field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentOrder = params.get("order");
    if (currentOrder === field) {
        params.set("order", `-${field}`);
    } else {
        params.set("order", field);
    }
    router.push(`?${params.toString()}`);
};