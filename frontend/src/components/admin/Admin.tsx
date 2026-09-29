import {IUser} from "../../../../backend/src/interfaces/IUser";
import Manager from "../manager/Manager";
import {FC, useState} from "react";
import CreateManagerForm from "../forms/CreateManagerForm";

interface IProp {
    managers:IUser[],
    updateStatus:(id: string, isActive: boolean) => void;
}

const Admin:FC<IProp> = ({managers, updateStatus}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button className='greenButton' onClick={()=> setIsOpen(true)}>Create</button>
            {isOpen && <CreateManagerForm onClose={()=>setIsOpen(false)}/>}
            {managers.map(manager => <Manager key={manager._id} manager={manager} updateStatus={updateStatus}/>)}
        </div>
    );
};

export default Admin;