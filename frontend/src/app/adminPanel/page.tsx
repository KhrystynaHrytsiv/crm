"use client"
import Admin from "../../components/admin/Admin";
import {useEffect} from "react";
import Header from "../../components/header/Header";
import {useAppDispatch} from "../../redux/hooks/reduxHooks";
import {managerAction} from "../../redux/slices/managerSlice";

const AdminPanel =  () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(managerAction.getManagers())
    }, []);
    return (
        <div>
            <Header/>
            <Admin/>
        </div>
    );
};

export default AdminPanel;