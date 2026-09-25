import {IUser} from "../../../../backend/src/interfaces/IUser";
import '../../app/globals.css';
import "./Manager.css";

const Manager = ({manager}:{manager:IUser}) => {
    return (

        <div className="container">
            <div className="info">
                {Object.entries(manager).map(([key, value]) => (
                    <p key={key}>{key}: {String(value)}</p>
                ))}
            </div>
            <div className="buttonBlock">
                <button className='greenButton'>Activate</button>
                <button className='greenButton'>Ban</button>
                <button className='greenButton'>Unban</button>
            </div>
        </div>

    );
};

export default Manager;