"use client"
import {generalService} from "../../services/generalService";
import {IUser} from "../../../../backend/src/interfaces/IUser";
import Admin from "../../components/admin/Admin";
import {useEffect, useState} from "react";
import Header from "../../components/header/Header";

const AdminPanel =  () => {
    const [managers, setManagers] = useState<IUser[]>([]);
    useEffect(() => {
    generalService.get<IUser[]>('/manager').then((res) =>setManagers(res));
    }, []);
    const updateManagerStatus = (id: string, isActive: boolean) => {
        setManagers(prev => prev.map(manager => manager._id === id ?
                { ...manager, is_Active: isActive } : manager));
    };
    return (
        <div>
            {/*<Header me={}/>*/}
            <Admin managers={managers} updateStatus={updateManagerStatus}/>
        </div>
    );
};

export default AdminPanel;