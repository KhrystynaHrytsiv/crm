"use client"
import {generalService} from "../../services/generalService";
import {IUser} from "../../../../backend/src/interfaces/IUser";
import Admin from "../../components/admin/Admin";
import {useEffect, useState} from "react";

const AdminPanel =  () => {
    const [managers, setManagers] = useState<IUser[]>([]);
    useEffect(() => {
    generalService.get<IUser[]>('/manager').then((res) =>setManagers(res));
    }, []);
    return (
        <div>
            <Admin managers={managers}/>
        </div>
    );
};

export default AdminPanel;