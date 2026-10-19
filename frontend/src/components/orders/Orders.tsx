"use client"
import {useRouter, useSearchParams} from "next/navigation";
import {IOrder} from "../../../../shared/interfaces/IOrder";
import css from "./Orders.module.css";
import {columns} from "../../../../shared/constance/orders";
import {Fragment, useState} from "react";
import Comment from "../comment/Comment";
import {useAppSelector} from "../../redux/hooks/reduxHooks";

const Orders = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {orders} = useAppSelector(state => state.orders);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    const handleSort = async(field: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentOrder = params.get("order");
        if (currentOrder === field) {
            params.set("order", `-${field}`);
        } else {
            params.set("order", field);
        }
        router.push(`?${params.toString()}`);
    };
    const renderValue = (value: unknown, key: keyof IOrder) => {
        if (value === null || value === undefined || value === "") {
            return "null";
        }
        if (key === "manager" && typeof value === "object" && value !== null) {
            return (value as { surname: string }).surname;
        }
        if (key === "created_at") {
            return new Date(value as Date).toLocaleDateString("en-US",
                {month: "long", day: "2-digit", year: "numeric",});
        }
        return String(value);
    };

    return (
        <table className={css.table}>
            <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column.key} onClick={() => handleSort(column.key)}>{column.key}</th>
                ))}
            </tr>
            </thead>

            <tbody>
                {orders.map((order, index) => (
                    <Fragment key={order._id}>
                        <tr key={order._id}  className={index % 2 === 0 ? css.evenRow : css.oddRow}>
                            {columns.map((column) => (
                                <td key={column.key} onClick={() => {
                                    setSelectedOrders(prev =>
                                        prev.includes(order._id)
                                            ? prev.filter(id => id !== order._id)
                                            : [...prev, order._id]
                                    );
                                }}>
                                    {renderValue(order[column.key], column.key)}
                                </td>
                            ))}
                        </tr>
                        {selectedOrders.includes(order._id) && (
                            <tr className={index % 2 === 0 ? css.commentEven : css.commentOdd}>
                                <td colSpan={columns.length}>
                                    <Comment order={order}/>
                                </td>
                            </tr>
                        )}
                    </Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default Orders;