"use client"
import { useSearchParams, useRouter } from "next/navigation";
import {IOrder} from "../../../../backend/src/interfaces/IOrder";
import css from "./Orders.module.css";
import {columns} from "../../constants/orders";

const Orders = ({orders}:{orders:IOrder[]}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

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
    const renderValue = (value: any) => value ? value: "null";
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
            {orders.map((order) => (
                <tr key={order._id}>
                    <td>{renderValue(order._id)}</td>
                    <td>{renderValue(order.name)}</td>
                    <td>{renderValue(order.surname)}</td>
                    <td>{renderValue(order.email)}</td>
                    <td>{renderValue(order.phone)}</td>
                    <td>{renderValue(order.age)}</td>
                    <td>{renderValue(order.course)}</td>
                    <td>{renderValue(order.course_format)}</td>
                    <td>{renderValue(order.course_type)}</td>
                    <td>{renderValue(order.sum)}</td>
                    <td>{renderValue(order.alreadyPaid)}</td>
                    <td>{renderValue(order.status)}</td>
                    <td>{renderValue(order.group)}</td>
                    <td>
                        {order.created_at
                            ? new Date(order.created_at).toLocaleDateString("en-US",
                                {month: "long", day: "2-digit", year: "numeric"}) : "null"}
                    </td>
                    <td>{renderValue(order.manager)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Orders;