"use client"
import {IOrder} from "../../../../shared/interfaces/IOrder";
import {useEffect, useState} from "react";
import OrderForm from "../forms/OrderForm";
import {useRouter} from "next/navigation";
import css from "./Comment.module.css"
import {useForm} from "react-hook-form";
import {CommentDto} from "../../../../shared/interfaces/IComment";
import {orderService} from "../../services/orderService";
import {joiResolver} from "@hookform/resolvers/joi";
import {CommentValidator} from "../../../../shared/validators/commentValidator";
import {useAppDispatch, useAppSelector} from "../../redux/hooks/reduxHooks";
import {orderActions} from "../../redux/slices/ordersSlice";

const Comment = ({order}: {order:IOrder}) => {
    const [openForm, setOpenForm] = useState(false);
    const {comments} = useAppSelector(state => state.orders);
    const {me} = useAppSelector(state => state.manager);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {handleSubmit, register, reset, formState:{isValid, errors}} = useForm<CommentDto>({mode: "all", resolver:joiResolver(CommentValidator.comment)});
    useEffect(() => {
        dispatch(orderActions.getComments(order._id))
    }, [order._id]);

    const onClose = () =>{
        setOpenForm(false)
        router.refresh();
    }

    const hasPermission = !!me && (!order.manager ||
        (typeof order.manager === "object" ? order.manager._id === me._id : order.manager === me._id));
    const create = async (dto:CommentDto) =>{
        try{
           await orderService.createComment(order._id,dto);
           reset();
           await dispatch(orderActions.getComments(order._id))
            router.refresh();
        }catch (e) {
            console.log(e);
        }
    }
    return (
        <div className={css.container}>
            <div>
                <p>Message: {order.msg ? order.msg : "null" }</p>
                <p>UTM: {order.utm ? order.utm : "null" }</p>
            </div>
            <div className={css.rightBlock}>
            <div className={css.details}>
                {comments.length > 0 && <div className={css.commentBlock}>
                    {comments.map(com => <div key={com._id} className={css.comment}>
                        <div>{com.comment}</div>
                        <div>{com.manager.surname} {new Date(com.created_At).toLocaleDateString("en-US", {month: "long", day: "2-digit", year: "numeric"})}</div>
                    </div>)}
                </div>}
                <form onSubmit={handleSubmit(create)} className={css.commentForm}>
                    <div className={css.inputBlock}>
                        <input type={"text"} placeholder={"Comment"} {...register("comment")}/>
                        {errors.comment?.message && <div className="error">{errors.comment?.message}</div>}
                    </div>
                    <button disabled={!isValid} className={isValid ? "greenButton" : "greyButton"}>Submit</button>
                </form>
            </div>
                <button className={hasPermission ? "greenButton" : "greyButton"} style={{width: "100px"}}
                        onClick={() => hasPermission && setOpenForm(true)}
                        disabled={!hasPermission}>Edit</button>
            </div>
            {openForm && <OrderForm onClose={onClose} order={order}/>}
        </div>
    );
};

export default Comment;