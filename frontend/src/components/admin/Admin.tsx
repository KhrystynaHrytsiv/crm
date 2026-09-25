import {IUser} from "../../../../backend/src/interfaces/IUser";
import Manager from "../manager/Manager";


const Admin = ({managers}:{managers:IUser[]}) => {

    return (
        <div>
            <button className='greenButton'>Create</button>
            {managers.map(manager => <Manager key={manager._id} manager={manager}/>)}
        </div>
    );
};

export default Admin;