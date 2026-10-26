"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import Filters from "../../components/filters/Filters";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Orders from "../../components/orders/Orders";
import Pagination from "../../components/pagination/Pagination";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { managerAction } from "../../redux/slices/managerSlice";
import { orderActions } from "../../redux/slices/ordersSlice";
import Loading from "../loading";

const OrdersContent = () => {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const { loading, totalPages } = useAppSelector((state) => state.orders);

    useEffect(() => {
        dispatch(managerAction.getMe());
        dispatch(orderActions.getGroups());
    }, [dispatch]);

    useEffect(() => {
        dispatch(orderActions.getOrders({ query: searchParams.toString() }));
    }, [searchParams, dispatch]);

    return (
        <div>
            <Header />
            <Filters />
            <Orders />
            {loading && <Loading />}
            <Pagination totalPages={totalPages} />
            <Footer />
        </div>
    );
};

const OrdersPage = () => (
    <Suspense fallback={<Loading />}>
        <OrdersContent />
    </Suspense>
);

export default OrdersPage;
