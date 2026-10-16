"use client";

import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import Orders from "../../components/orders/Orders";
import Filters from "../../components/filters/Filters";
import Header from "../../components/header/Header";
import {useAppDispatch, useAppSelector} from "../../redux/hooks/reduxHooks";
import {managerAction} from "../../redux/slices/managerSlice";
import {orderActions} from "../../redux/slices/ordersSlice";
import Loading from "../loading";
import Footer from "../../components/footer/Footer";
import Pagination from "../../components/pagination/Pagination";

const OrdersPage = () => {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const {loading} = useAppSelector(state => state.orders);

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
            {loading && <Loading/>}
            <Pagination/>
            <Footer/>
        </div>
    );
};

export default OrdersPage;
