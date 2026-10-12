import {IUser} from "../../../../backend/src/interfaces/IUser";
import Manager from "../manager/Manager";
import {FC, useState} from "react";
import CreateManagerForm from "../forms/CreateManagerForm";
import {useAppSelector} from "../../redux/hooks/reduxHooks";


const Admin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {managers} = useAppSelector(state => state.manager);
    return (
        <div>
            <button className='greenButton' onClick={()=> setIsOpen(true)}>Create</button>
            {isOpen && <CreateManagerForm onClose={()=>setIsOpen(false)}/>}
            {managers && managers.map(manager => <Manager key={manager._id} manager={manager}/>)}
        </div>
    );
};

export default Admin;