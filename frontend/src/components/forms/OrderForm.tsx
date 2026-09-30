// import {useForm} from "react-hook-form";
// import {Filter, inputs} from "../../constants/filters";
// import css from "./OrderForm.module.css"
//
// const OrderForm = ({filters, onClose}:{filters:Filter, onClose: ()=> void}) => {
//     const {register, handleSubmit} = useForm();
//     // const submit = async (dto:OrderDTO) =>{
//     //     try{
//     //         await orderService.update(id, dto)
//     //     }catch (e) {
//     //         console.log(e);
//     //     }
//     // }
//     return (
//         <div className="overlay">
//             <form className={css.form}>
//                 {inputs.map(item =>
//                     <div key={item.key} className={css.field}>
//                        <label htmlFor={item.key}>{item.label}</label>
//                         <input type={item.type} {...register(item.key)} placeholder={item.key}/>
//                     </div>)}
//                 {filters.map((filter) =>
//                     <div className={css.field} key={filter.key}>
//                         <label htmlFor={filter.key}> {filter.label}</label>
//                         <select key={filter.key}>
//                             <option value="">{filter.placeholder}</option>
//                             {filter.options.map((option: string) => <option key={option} value={option}>{option}</option>)}
//                         </select>
//                     </div>
//                 )}
//
//                 <div className={css.buttonBlock}>
//                 {/*<div className='buttonBlock' style={{gridColumn:"1 / -1"}}>*/}
//                     <button className='greenButton' onClick={onClose} style={{fontSize:"14px"}}>Close</button>
//                     <button className='greenButton' style={{fontSize:"14px"}}>Submit</button>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default OrderForm;
"use client";

import {useForm} from "react-hook-form";
import {extendedInputs, fieldOrder, Filter} from "../../constants/filters";
import css from "./OrderForm.module.css";
import {OrderDTO} from "../../../../backend/src/interfaces/IOrder";
import {orderService} from "../../services/orderService";
import {FC} from "react";
import {joiResolver} from "@hookform/resolvers/joi";
import {OrderValidator} from "../../../../backend/src/validators/orderValidator";

interface IProp {
    filters: Filter,
    onClose: () => void,
    orderId:string,
}

const OrderForm:FC<IProp> = ({filters, onClose, orderId}) => {
    const { register, handleSubmit, formState:{isValid, errors} } = useForm<OrderDTO>({mode: "all", resolver:joiResolver(OrderValidator.update)});
    const submit = async (dto:OrderDTO) =>{
        try{
            await orderService.update(orderId, dto)
        }catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="overlay">
            <form className={css.form} onSubmit={handleSubmit(submit)}>
                {fieldOrder.map((key) => {
                    const filter = filters.find((item) => item.key === key);

                    if (filter) {
                        return (
                            <div key={key} className={css.field}>
                                <label htmlFor={key}>{filter.label}</label>
                                <select id={key}{...register(key)}>
                                    <option value="">{filter.placeholder}</option>
                                    {filter.options.map((option: string) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
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
                    <button type="submit" className="greenButton" disabled={!isValid}>Submit</button>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;