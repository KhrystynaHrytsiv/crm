"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { generalService } from "../../services/generalService";
import { IOrder } from "../../../../backend/src/interfaces/IOrder";
import { IResPagination } from "../../../../backend/src/interfaces/IResPagination";
import Orders from "../../components/orders/Orders";
import Filters from "../../components/filters/Filters";
import Header from "../../components/header/Header";
import {IUser} from "../../../../backend/src/interfaces/IUser";

const OrdersPage = () => {
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [me, setMe] = useState<IUser>();
    useEffect(() => {
        const query = searchParams.toString();
        const getData = async () => {
            const [orders, me] = await Promise.all([
                generalService.get<IResPagination<IOrder>>(`/orders?${query}`),
                generalService.get<IUser>("/auth/me")
            ]);
            setOrders(orders.data);
            setMe(me);
        };
        getData();
    }, [searchParams]);

    return (
        <div>
            {me && <Header me={me}/>}
            {me && <Filters surname={me.surname}/>}
            <Orders orders={orders} />
        </div>
    );
};

export default OrdersPage;
