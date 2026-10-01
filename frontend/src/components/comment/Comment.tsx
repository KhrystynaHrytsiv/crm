"use client"
import {IOrder} from "../../../../backend/src/interfaces/IOrder";
import {useEffect, useState} from "react";
import OrderForm from "../forms/OrderForm";
import {Filter} from "../../constants/filters";
import {useRouter} from "next/navigation";
import css from "./Comment.module.css"
import {useForm} from "react-hook-form";
import {CommentDto, IComment} from "../../../../backend/src/interfaces/IComment";
import {orderService} from "../../services/orderService";
import {generalService} from "../../services/generalService";

const Comment = ({order, filters}: {order:IOrder, filters:Filter}) => {
    const [openForm, setOpenForm] = useState(false);
    const [comments, setComments] = useState<IComment[]>([]);
    const router = useRouter();
    const {handleSubmit, register} = useForm<CommentDto>();

    const onClose = () =>{
        setOpenForm(false)
        router.refresh();
    }
    const create = async (dto:CommentDto) =>{
        try{
           await orderService.createComment(order._id,dto);
            router.refresh();
        }catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        generalService.get<IComment[]>(`/orders/${order._id}/comments`).then((data) => setComments(data))
    }, [order._id]);
    return (
        <div className={css.container}>
            <div>
                <p>Message: {order.msg}</p>
                <p>UTM: {order.utm}</p>
            </div>
            <div className={css.rightBlock}>
            <div className={css.details}>
                {comments.map(com => <div key={com._id}>
                    <div>{com.comment}</div>
                    <div>{com.manager} {new Date(com.created_At).toLocaleDateString("en-US", {month: "long", day: "2-digit", year: "numeric",})}</div>
                </div>)}
                <form onSubmit={handleSubmit(create)} className={css.commentForm}>
                    <input type={"text"} placeholder={"Comment"} {...register("comment")}/>
                    <button>Submit</button>
                </form>
            </div>
                <button className='greenButton' style={{width: "100px"}} onClick={()=>setOpenForm(true)}>Edit</button>
            </div>
            {openForm && <OrderForm filters={filters} onClose={onClose} order={order}/>}
        </div>
    );
};

export default Comment;