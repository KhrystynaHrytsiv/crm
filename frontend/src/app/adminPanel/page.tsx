"use client"
import {generalService} from "../../services/generalService";
import {IUser} from "../../../../backend/src/interfaces/IUser";
import Admin from "../../components/admin/Admin";
import {useEffect, useState} from "react";
import Header from "../../components/header/Header";

const AdminPanel =  () => {
    const [managers, setManagers] = useState<IUser[]>([]);
    const [me, setMe] = useState<IUser>()
    useEffect(() => {
        const getData = async () => {
            const [managers, me] = await Promise.all([
                generalService.get<IUser[]>('/manager'),
                generalService.get<IUser>("/auth/me"),
            ]);
            setManagers(managers);
            setMe(me);
        };
        getData();
    }, []);
    const updateManagerStatus = (id: string, isActive: boolean) => {
        setManagers(prev => prev.map(manager => manager._id === id ?
                { ...manager, is_Active: isActive } : manager));
    };
    return (
        <div>
            {me && <Header me={me}/>}
            <Admin managers={managers} updateStatus={updateManagerStatus}/>
        </div>
    );
};

export default AdminPanel;