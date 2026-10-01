"use client"
import {IOrder} from "../../../../backend/src/interfaces/IOrder";
import {useState} from "react";
import OrderForm from "../forms/OrderForm";
import {Filter} from "../../constants/filters";
import {useRouter} from "next/navigation";
import css from "./Comment.module.css"

const Comment = ({order, filters}: {order:IOrder, filters:Filter}) => {
    const router = useRouter();
    const [openForm, setOpenForm] = useState(false);
    const onClose = () =>{
        setOpenForm(false)
        router.refresh();
    }
    return (
        <div className={css.container}>
            <div>
                <p>Message: {order.msg}</p>
                <p>UTM: {order.utm}</p>
            </div>
            <div className={css.details}>
                <div className={css.commentBlock}>
                    <input type={"text"} placeholder={"Comment"}/>
                    <button>Submit</button>
                </div>
                <button className='greenButton' style={{width: "100px"}} onClick={()=>setOpenForm(true)}>Edit</button>
            </div>
            {openForm && <OrderForm filters={filters} onClose={onClose} order={order}/>}
        </div>
    );
};

export default Comment;