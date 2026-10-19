"use client";

import { useForm } from "react-hook-form";
import { extendedInputs, fieldOrder, filters } from "../../constants/filters";
import css from "./OrderForm.module.css";
import { IOrder, OrderDTO } from "../../../../shared/interfaces/IOrder";
import { orderService } from "../../services/orderService";
import { FC, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { OrderValidator } from "../../../../shared/validators/orderValidator";
import {useAppDispatch, useAppSelector} from "../../redux/hooks/reduxHooks";
import { orderActions } from "../../redux/slices/ordersSlice";

interface IProp {
    onClose: () => void;
    order: IOrder;
}

type FormValues = OrderDTO & { newGroup?: string };

const OrderForm: FC<IProp> = ({ onClose, order }) => {
    const [showGroupAction, setShowGroupAction] = useState(false);
    const {_id, created_at, manager, msg, utm, alreadyPaid, ...formValues} = order;
    const { groups } = useAppSelector((state) => state.orders);
    const allFilters = filters(groups);
    const dispatch = useAppDispatch();

    const {register, handleSubmit, formState: { errors }, getValues, setError, clearErrors, setValue} = useForm<FormValues>({
        mode: "all", resolver: joiResolver(OrderValidator.update), defaultValues: formValues});

    const submit = async (dto: OrderDTO) => {
        try {
            await orderService.update(_id, dto);
            onClose();
        } catch (e) {
            console.log(e);
        }
    };

    const addGroup = async () => {
        clearErrors("newGroup");
        const newGroup = getValues("newGroup")?.trim();
        if (!newGroup) {
            setError("newGroup", {type: "manual", message: "Group name is required"});
            return;
        }
        if (groups.includes(newGroup)) {
            setError("newGroup", {type: "manual", message: "This group already exists"});
            return;
        }
        try {
            await orderService.update(order._id, { group: newGroup });
            await dispatch(orderActions.getGroups());
            setValue("group", newGroup, {shouldDirty: true, shouldValidate: true});
            setShowGroupAction(false);
        } catch {
            setError("newGroup", {type: "server", message: "Failed to add group. Please try again."});
        }
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
                <div className={css.buttonBlock}>
                     <button type="button" className="greenButton" onClick={onClose}>Close</button>
                    <button type="submit" className="greenButton">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;