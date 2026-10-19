import css from "./Manager.module.css";
import {managerService} from "../../services/managerService";
import {ActionTokenType} from "../../../../backend/src/enums/tokenEnum";
import {ActionType} from "../../../../shared/interfaces/ActionType";
import {FC} from "react";
import {useAppDispatch} from "../../redux/hooks/reduxHooks";
import {managerAction} from "../../redux/slices/managerSlice";
import {IManagerWithStatistics} from "../../../../shared/interfaces/IManagerWithStatistics";

interface IProp {
    managerWithStatistic:IManagerWithStatistics,
}
const Manager:FC<IProp> = ({managerWithStatistic}) => {
    const {manager, statistics} = managerWithStatistic;
    const dispatch = useAppDispatch();
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
           await managerService.changeStatus(manager._id, action);
           dispatch(managerAction.updateManagerStatus({id: manager._id, isActive: action === "unban"}));

       }catch (e) {
           console.log(e);
       }
   }
    return (
        <div className={css.block}>
            <div className={css.info}>
                {Object.entries(manager).map(([key, value]) => (
                    (key !== 'role') &&
                    <p key={key}>{key}: { key === "last_login" ? value
                            ? new Date(String(value)).toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"})
                            : "null"
                        : String(value)
                    }</p>
                ))}
            </div>
            <div className={css.statistic}>
                {Object.entries(statistics).map(([key, value]) =>
                        (value > 0 || key === "total") && <p key={key}>{key}: {String(value)}</p>
                    )}
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