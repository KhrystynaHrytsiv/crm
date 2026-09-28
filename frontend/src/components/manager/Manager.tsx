import {IUser} from "../../../../backend/src/interfaces/IUser";
import '../../app/globals.css';
import "./Manager.css";
import {managerService} from "../../services/managerService";
import {ActionTokenType} from "../../../../backend/src/enums/tokenEnum";
import {ActionType} from "../../../../backend/src/interfaces/ActionType";

const Manager = ({manager}:{manager:IUser}) => {
   const handleAction = async (action:ActionTokenType) =>{
       try{
        const url = await managerService.actionRequest(manager._id, action);
           await navigator.clipboard.writeText(url);
           alert("Link copied to clipboard");
       }catch (e) {
           console.log(e);
       }
   }
   const changeStatus = async (action:ActionType) =>{
       try{
           return await managerService.changeStatus(manager._id, action)
       }catch (e) {
           console.log(e);
       }
   }
    return (
        <div className="block">
            <div className="info">
                {Object.entries(manager).map(([key, value]) => (
                    <p key={key}>{key}: {String(value)}</p>
                ))}
            </div>
            <div className="buttonBlock">
                <button className='greenButton' onClick={() =>
                    manager.is_Active ?
                        handleAction(ActionTokenType.recovery) :
                        handleAction(ActionTokenType.activate) }>
                    {manager.is_Active ? "Recovery password" : "Activate"}</button>
                <button className='greenButton' onClick={()=> changeStatus('ban')}>Ban</button>
                <button className='greenButton' onClick={()=> changeStatus('unban')}>Unban</button>
            </div>
        </div>

    );
};

export default Manager;