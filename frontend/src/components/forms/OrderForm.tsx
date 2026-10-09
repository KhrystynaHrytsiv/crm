// "use client";
//
// import {useForm} from "react-hook-form";
// import {extendedInputs, fieldOrder, filters} from "../../constants/filters";
// import css from "./OrderForm.module.css";
// import {IOrder, OrderDTO} from "../../../../backend/src/interfaces/IOrder";
// import {orderService} from "../../services/orderService";
// import {FC, useState} from "react";
// import {joiResolver} from "@hookform/resolvers/joi";
// import {OrderValidator} from "../../../../backend/src/validators/orderValidator";
// import {useAppDispatch, useAppSelector} from "../../redux/hooks/reduxHooks";
// import {orderActions} from "../../redux/slices/ordersSlice";
//
// interface IProp {
//     onClose: () => void,
//     order:IOrder,
// }
// type FormValues = OrderDTO & { newGroup?: string};
//
// const OrderForm:FC<IProp> = ({onClose, order}) => {
//     const [showGroupAction, setShowGroupAction] = useState(false);
//     const {_id, created_at, manager, msg, utm, alreadyPaid, ...formValues} = order;
//     const {groups} = useAppSelector(state => state.orders);
//     const allFilters = filters(groups);
//     const { register, handleSubmit, formState:{ errors}, getValues } = useForm<FormValues>({mode: "all", resolver:joiResolver(OrderValidator.update), defaultValues: formValues});
//     const dispatch = useAppDispatch();
//     const submit = async (dto:OrderDTO) =>{
//         try{
//             await orderService.update(_id, dto);
//             onClose();
//         }catch (e) {
//             console.log(e);
//         }
//     }
//     const addGroup = async () => {
//         const newGroup = getValues("newGroup")?.trim();
//         try {
//             if (!newGroup) {
//                 throw new Error("Group name is required");
//             }
//             if (groups.includes(newGroup)) {
//                 throw new Error("This group already exists");
//             }
//             await orderService.update(order._id, {group: newGroup});
//             dispatch(orderActions.getGroups());
//             setShowGroupAction(false);
//         } catch (e) {
//             console.log(e);
//         }
//     };
//     return (
//         <div className="overlay">
//             <form className={css.form} onSubmit={handleSubmit(submit)}>
//                 {fieldOrder.map((key) => {
//                     const filter = allFilters.find((item) => item.key === key);
//                     if (filter) {
//                         return (
//                             <div key={key} className={css.field}>
//                                 <label htmlFor={key}>{filter.label}</label>
//                                 {(key !== "group" || !showGroupAction) && (
//                                 <select id={key}{...register(key)}>
//                                     <option value="">{filter.placeholder}</option>
//                                     {filter.options.map((option: string) => (
//                                         <option key={option} value={option}>{option}</option>
//                                     ))}
//                                 </select>
//                                 )}
//                                 {key === "group" && (
//                                     <>
//                                         {!showGroupAction &&
//                                         <button type="button" className={css.addButton}
//                                                 onClick={() => setShowGroupAction(true)}>Add group
//                                         </button>
//                                         }
//
//                                         {showGroupAction && (
//                                             <div className={css.groupActions}>
//                                                 <input type="text" placeholder="New group"{...register("newGroup")}/>
//                                                 <div className={css.addButtonsBlock}>
//                                                 <button type={"button"} onClick={addGroup} className={css.addButton} >Add</button>
//                                                 <button type={"button"}  onClick={() => setShowGroupAction(false)} className={css.addButton}>Select</button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </>
//                                 )}
//
//                             </div>
//                         );
//                     }
//
//                     const input = extendedInputs.find((item) => item.key === key);
//
//                     if (input) {
//                         return (
//                             <div key={key} className={css.field}>
//                                 <label htmlFor={key}>{input.label}</label>
//                                 <input id={key} type={input.type} placeholder={input.key}{...register(key)}/>
//                                 {errors[key] && (<div className="error">{errors[key].message}</div>)}
//                             </div>
//                         );
//                     }
//                     return null;
//                 })}
//
//                 <div className={css.buttonBlock}>
//                     <button type="button" className="greenButton" onClick={onClose}>Close</button>
//                     <button type="submit" className="greenButton">Submit</button>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default OrderForm;

"use client";

import { useForm } from "react-hook-form";
import { extendedInputs, fieldOrder, filters } from "../../constants/filters";
import css from "./OrderForm.module.css";
import { IOrder, OrderDTO } from "../../../../backend/src/interfaces/IOrder";
import { orderService } from "../../services/orderService";
import { FC, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { OrderValidator } from "../../../../backend/src/validators/orderValidator";
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

    const {register, handleSubmit, formState: { errors }, getValues} = useForm<FormValues>({
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
        const newGroup = getValues("newGroup")?.trim();
        try {
            if (!newGroup) {
                throw new Error("Group name is required");
            }

            if (groups.includes(newGroup)) {
                throw new Error("This group already exists");
            }
            await orderService.update(order._id, { group: newGroup });
            dispatch(orderActions.getGroups());
            setShowGroupAction(false);
        } catch (e) {
            console.log(e);
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
                                                <input type="text" placeholder="New group"{...register("newGroup")}/>
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