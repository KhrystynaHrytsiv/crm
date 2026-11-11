import { FC } from "react";

import { RoleEnum } from "../../../../shared/enums/roleEnum";
import { ActionTokenType } from "../../../../shared/enums/tokenEnum";
import { ActionType } from "../../../../shared/interfaces/ActionType";
import { IManagerWithStatistics } from "../../../../shared/interfaces/IManagerWithStatistics";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { managerAction } from "../../redux/slices/managerSlice";
import { managerService } from "../../services/managerService";
import css from "./Manager.module.css";

interface IProp {
    managerWithStatistic: IManagerWithStatistics;
}
const Manager: FC<IProp> = ({ managerWithStatistic }) => {
    const { me } = useAppSelector((state) => state.manager);
    const { manager, statistics } = managerWithStatistic;
    const dispatch = useAppDispatch();
    const isAdmin = manager.role === RoleEnum.admin && manager._id === me?._id;
    const handleAction = async (action: ActionTokenType) => {
            try {
                const url = await managerService.actionRequest(manager._id, action);
                await navigator.clipboard.writeText(url);
                alert("Link copied to clipboard");
            } catch (e) {
                alert(getErrorMessage(e));
            }
        };
    const changeStatus = async (action: ActionType) => {
        try {
            await managerService.changeStatus(manager._id, action);
            dispatch(
                managerAction.updateManagerStatus({
                    id: manager._id,
                    is_Banned: action === "ban",
                }),
            );
        } catch (e) {
            alert(getErrorMessage(e));
        }
    };
    return (
        <div className={css.block}>
            <div className={css.info}>
                {Object.entries(manager).map(
                    ([key, value]) =>
                        key !== "role" &&
                        key !== "is_Banned" && (
                            <p key={key}>
                                {key}:{" "}
                                {key === "last_login"
                                    ? value
                                        ? new Date(
                                              String(value),
                                          ).toLocaleDateString("en-US", {
                                              month: "long",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : "null"
                                    : String(value)}
                            </p>
                        ),
                )}
            </div>
            <div className={css.statistic}>
                {Object.entries(statistics).map(
                    ([key, value]) =>
                        (value > 0 || key === "total") && (
                            <p key={key}>
                                {key}: {String(value)}
                            </p>
                        ),
                )}
            </div>
            <div className="buttonBlock">
                <button
                    className="greenButton"
                    onClick={() =>
                        manager.is_active
                            ? handleAction(ActionTokenType.recovery)
                            : handleAction(ActionTokenType.activate)
                    }
                >
                    {manager.is_active ? "Recovery password" : "Activate"}
                </button>
                {!isAdmin && (
                    <>
                        <button
                            className={
                                !manager.is_banned
                                    ? "greenButton"
                                    : "greyButton"
                            }
                            onClick={() => changeStatus("ban")}
                            disabled={manager.is_banned}
                        >
                            Ban
                        </button>
                        <button
                            className={
                                manager.is_banned ? "greenButton" : "greyButton"
                            }
                            onClick={() => changeStatus("unban")}
                            disabled={!manager.is_banned}
                        >
                            Unban
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Manager;
