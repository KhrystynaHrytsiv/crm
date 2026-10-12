"use client";

import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import Orders from "../../components/orders/Orders";
import Filters from "../../components/filters/Filters";
import Header from "../../components/header/Header";
import {useAppDispatch} from "../../redux/hooks/reduxHooks";
import {managerAction} from "../../redux/slices/managerSlice";
import {orderActions} from "../../redux/slices/ordersSlice";

const OrdersPage = () => {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const query = searchParams.toString();
        dispatch(managerAction.getMe());
        dispatch(orderActions.getOrders({query}));
        dispatch(orderActions.getGroups());
    }, [searchParams, dispatch]);
    return (
        <div>
            <Header/>
            <Filters/>
            <Orders/>
        </div>
    );
};

export default OrdersPage;
