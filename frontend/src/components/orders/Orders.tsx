"use client"
import {useRouter, useSearchParams} from "next/navigation";
import {IOrder} from "../../../../backend/src/interfaces/IOrder";
import css from "./Orders.module.css";
import {columns} from "../../constants/orders";
import {useState} from "react";
import OrderForm from "../forms/OrderForm";
import {Filter} from "../../constants/filters";

const Orders = ({orders, filters}:{orders:IOrder[], filters:Filter}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

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

        if (key === "created_at") {
            return new Date(value as Date).toLocaleDateString("en-US",
                {month: "long", day: "2-digit", year: "numeric",});
        }
        return String(value);
    };
    return (
        <>
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
                    {columns.map((column) => (
                        <td key={column.key} onClick={()=>setSelectedOrderId(order._id)}>
                            {renderValue(order[column.key], column.key)}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    {selectedOrderId && <OrderForm filters={filters} onClose={()=>setSelectedOrderId(null)} orderId={selectedOrderId}/>}
    </>
    );
};

export default Orders;