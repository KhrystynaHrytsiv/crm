"use client";

import { useForm } from "react-hook-form";
import { extendedInputs, fieldOrder, filters } from "../../constants/filters";
import css from "./OrderForm.module.css";
import { IOrder, OrderDTO } from "../../../../shared/interfaces/IOrder";
import { orderService } from "../../services/orderService";
import { FC, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { OrderValidator } from "../../../../shared/validators/orderValidator";
import {useAppSelector} from "../../redux/hooks/reduxHooks";
import {getErrorMessage} from "../../helpers/getErrorMessage";

interface IProp {
    onClose: () => void;
    order: IOrder;
}

type FormValues = OrderDTO & { newGroup?: string };

const OrderForm: FC<IProp> = ({ onClose, order }) => {
    const [showGroupAction, setShowGroupAction] = useState(false);
    const [newGroups, setNewGroups] = useState<string[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);
    const { groups } = useAppSelector((state) => state.orders);
    const allGroups = [...groups, ...newGroups];
    const allFilters = filters(allGroups);
    const defaultValues = Object.fromEntries(fieldOrder.map((key) => [key, order[key] ?? ""])) as FormValues;

    const {register, handleSubmit, formState: { errors }, getValues, setError, clearErrors, setValue} = useForm<FormValues>({
        mode: "all", resolver: joiResolver(OrderValidator.update), defaultValues});

    const submit = async (dto: OrderDTO) => {
        try {
            setServerError(null);
            await orderService.update(order._id, dto);
            onClose();
        } catch (e) {
            setServerError(getErrorMessage(e));
        }
    };

    const addGroup = () => {
        clearErrors("newGroup");
        const newGroup = getValues("newGroup")?.trim();
        if (!newGroup) {
            setError("newGroup", {type: "manual", message: "Group name is required"});
            return;
        }
        if (allGroups.some((group) => group.toLowerCase() === newGroup.toLowerCase())) {
            setError("newGroup", {type: "manual", message: "This group already exists"});
            return;
        }
        setNewGroups((prev) => [...prev, newGroup]);
        setValue("group", newGroup, {shouldDirty: true, shouldValidate: true});
        setValue("newGroup", "");
        setShowGroupAction(false);
    };


    return (
        <div className="overlay">
            <form className={css.form} onSubmit={handleSubmit(submit)}>
                {fieldOrder.map((key) => {
                    const filter = allFilters.find((item) => item.key === key);
                    if (filter) {
                        const select = (
                            <select id={key} {...register(key)}>
                                <option value="">{filter.placeholder}</option>
                                {filter.options.map((option: string) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        );

                        return (
                            <div key={key} className={css.field}>
                                <label htmlFor={key}>{filter.label}</label>
                                {key === "group" ? (
                                    <div className={css.groupActions}>
                                        {showGroupAction ?
                                            <>
                                                <input type="text" placeholder="New group"{...register("newGroup")} onChange={() => clearErrors("newGroup")}/>
                                                {errors.newGroup && (<div className="error">{errors.newGroup.message}</div>)}
                                                <div className={css.addButtonsBlock}>
                                                    <button type="button" onClick={addGroup}
                                                            className={css.addButton}>Add
                                                    </button>
                                                    <button type="button" onClick={() => setShowGroupAction(false)}
                                                            className={css.addButton}>Select
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            <>{select}
                                                <div className={css.addButtonsBlock}>
                                                    <button type="button" className={css.addButton}
                                                            onClick={() => setShowGroupAction(true)}>Add group
                                                    </button>
                                                </div>
                                            </>
                                        }
                                    </div>
                                ) : select}
                            </div>
                        );
                    }

                    const input = extendedInputs.find((item) => item.key === key);
                    if (input) {
                        return (
                            <div key={key} className={css.field}>
                                <label htmlFor={key}>{input.label}</label>
                                <input id={key} type={input.type} placeholder={input.key}{...register(key)}/>
                                {errors[key] && (<div className="error">{errors[key].message}</div>)}
                            </div>
                        );
                    }
                    return null;
                })}
                {serverError && <div className="error">{serverError}</div>}
                <div className={css.buttonBlock}>
                     <button type="button" className="greenButton" onClick={onClose}>Close</button>
                    <button type="submit" className="greenButton">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;