import Manager from "../manager/Manager";
import {useState} from "react";
import CreateManagerForm from "../forms/CreateManagerForm";
import {useAppSelector} from "../../redux/hooks/reduxHooks";


const Admin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {managers} = useAppSelector(state => state.manager);
    const {statistics} = useAppSelector(state => state.orders);
    return (
        <div>
            <div style={{display:"flex", alignItems:"center", flexDirection: "column", fontSize: "17px"}}>
               <p>Order Statistic</p>
                <div>{Object.entries(statistics).map(([key, value]) => (
                    <span key={key} style={{margin: '5px'}}>{key}: {value}</span>
                ))}</div>
            </div>
            <button className='greenButton' onClick={()=> setIsOpen(true)}>Create</button>
            {isOpen && <CreateManagerForm onClose={()=>setIsOpen(false)}/>}
            {managers && managers.map(manager => <Manager key={manager._id} manager={manager}/>)}
        </div>
    );
};

export default Admin;