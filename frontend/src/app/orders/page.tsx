"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { generalService } from "../../services/generalService";
import { IOrder } from "../../../../backend/src/interfaces/IOrder";
import { IResPagination } from "../../../../backend/src/interfaces/IResPagination";
import Orders from "../../components/orders/Orders";
import Filters from "../../components/filters/Filters";
import Header from "../../components/header/Header";

const OrdersPage = () => {
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<IOrder[]>([]);

    useEffect(() => {
        const query = searchParams.toString();
        const getOrders = async () => {
            const response = await generalService.get<IResPagination<IOrder>>(`/orders?${query}`);
            setOrders(response.data);
        };
        getOrders();
    }, [searchParams]);

    return (
        <div>
            <Header />
            <Filters />
            <Orders orders={orders} />
        </div>
    );
};

export default OrdersPage;
