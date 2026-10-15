"use client"
import Admin from "../../components/admin/Admin";
import React, {useEffect} from "react";
import Header from "../../components/header/Header";
import {useAppDispatch, useAppSelector} from "../../redux/hooks/reduxHooks";
import {managerAction} from "../../redux/slices/managerSlice";
import {orderActions} from "../../redux/slices/ordersSlice";
import Loading from "../loading";

const AdminPanel =  () => {
    const dispatch = useAppDispatch();
    const {loading} = useAppSelector(state => state.orders);

    useEffect(() => {
        dispatch(managerAction.getMe());
        dispatch(managerAction.getManagers())
        dispatch(orderActions.getStatistics())
    }, []);
    return (
        <div>
            <Header/>
            <Admin/>
            {loading && <Loading/>}
        </div>
    );
};

export default AdminPanel;