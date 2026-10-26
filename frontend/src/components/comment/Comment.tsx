"use client";
import { joiResolver } from "@hookform/resolvers/joi";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { CommentDto } from "../../../../shared/interfaces/IComment";
import { IOrder } from "../../../../shared/interfaces/IOrder";
import { CommentValidator } from "../../../../shared/validators/commentValidator";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { CommentResponse } from "../../interfaces/CommentResponse";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { orderActions } from "../../redux/slices/ordersSlice";
import { orderService } from "../../services/orderService";
import OrderForm from "../forms/OrderForm";
import css from "./Comment.module.css";

const Comment = ({ order }: { order: IOrder }) => {
    const [openForm, setOpenForm] = useState(false);
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);
    const { me } = useAppSelector((state) => state.manager);
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const {
        handleSubmit,
        register,
        reset,
        formState: { isValid, errors },
    } = useForm<CommentDto>({
        mode: "all",
        resolver: joiResolver(CommentValidator.comment),
    });

    const loadComments = useCallback(
        () => orderService.getComments(order._id),
        [order._id],
    );

    useEffect(() => {
        let active = true;
        loadComments()
            .then((data) => active && setComments(data))
            .catch((e) => active && setServerError(getErrorMessage(e)));
        return () => {
            active = false;
        };
    }, [loadComments]);

    const refreshOrders = () =>
        dispatch(orderActions.getOrders({ query: searchParams.toString() }));

    const onClose = () => {
        setOpenForm(false);
        void refreshOrders();
    };

    const hasPermission =
        !!me &&
        (!order.manager ||
            (typeof order.manager === "object"
                ? order.manager._id === me._id
                : order.manager === me._id));
    const create = async (dto: CommentDto) => {
        try {
            setServerError(null);
            await orderService.createComment(order._id, dto);
            reset();
            setComments(await loadComments());
            void refreshOrders();
        } catch (e) {
            setServerError(getErrorMessage(e));
        }
    };
    const canSubmit = hasPermission && isValid;
    return (
        <div className={css.container}>
            <div>
                <p>Message: {order.msg ? order.msg : "null"}</p>
                <p>UTM: {order.utm ? order.utm : "null"}</p>
            </div>
            <div className={css.rightBlock}>
                <div className={css.details}>
                    {comments.length > 0 && (
                        <div className={css.commentBlock}>
                            {comments.map((com) => (
                                <div key={com._id} className={css.comment}>
                                    <div>{com.comment}</div>
                                    <div>
                                        {com.manager.surname}{" "}
                                        {new Date(
                                            com.created_At,
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "2-digit",
                                            year: "numeric",
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <form
                        onSubmit={handleSubmit(create)}
                        className={css.commentForm}
                    >
                        <div className={css.inputBlock}>
                            <input
                                type={"text"}
                                placeholder={"Comment"}
                                disabled={!hasPermission}
                                {...register("comment")}
                            />
                            {errors.comment?.message && (
                                <div className="error">
                                    {errors.comment?.message}
                                </div>
                            )}
                            {serverError && (
                                <div className="error">{serverError}</div>
                            )}
                        </div>
                        <button
                            disabled={!canSubmit}
                            className={canSubmit ? "greenButton" : "greyButton"}
                        >
                            Submit
                        </button>
                    </form>
                </div>
                <button
                    className={hasPermission ? "greenButton" : "greyButton"}
                    style={{ width: "100px" }}
                    onClick={() => hasPermission && setOpenForm(true)}
                    disabled={!hasPermission}
                >
                    Edit
                </button>
            </div>
            {openForm && <OrderForm onClose={onClose} order={order} />}
        </div>
    );
};

export default Comment;
