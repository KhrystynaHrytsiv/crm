"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import { RoleEnum } from "../../../../backend/src/enums/roleEnum";
import Admin from "../../components/admin/Admin";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Pagination from "../../components/pagination/Pagination";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { managerAction } from "../../redux/slices/managerSlice";
import { orderActions } from "../../redux/slices/ordersSlice";
import Loading from "../loading";

const AdminPanel = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const { me, loading, managersTotalPages } = useAppSelector(
        (state) => state.manager,
    );
    const isAdmin = me?.role === RoleEnum.admin;

    useEffect(() => {
        dispatch(managerAction.getMe());
    }, [dispatch]);

    useEffect(() => {
        if (me && !isAdmin) {
            router.replace("/orders");
        }
    }, [me, isAdmin, router]);

    useEffect(() => {
        if (isAdmin) {
            dispatch(orderActions.getStatistics());
            dispatch(managerAction.getManagers(page));
        }
    }, [isAdmin, page, dispatch]);

    if (!isAdmin) {
        return <Loading />;
    }
    return (
        <div>
            <Header />
            <Admin />
            {loading && <Loading />}
            <Pagination totalPages={managersTotalPages} />
            <Footer />
        </div>
    );
};

export default AdminPanel;
