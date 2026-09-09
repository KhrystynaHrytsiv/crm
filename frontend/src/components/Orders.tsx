import {IOrder} from "../../../backend/src/interfaces/IOrder";

const Orders = ({orders}:{orders:IOrder[]}) => {
    return (
        <table>
            <thead style={{backgroundColor: "lime"}}>
            <tr>
                <th>id</th>
                <th>name</th>
                <th>surname</th>
                <th>email</th>
                <th>phone</th>
                <th>age</th>
                <th>course</th>
                <th>course_format</th>
                <th>course_type</th>
                <th>sum</th>
                <th>alreadyPaid</th>
                <th>status</th>
            </tr>
            </thead>

            <tbody >
            {orders.map((order) => (
                <tr key={order.id}>
                    <td>{order.name}</td>
                    <td>{order.surname}</td>
                    <td>{order.email}</td>
                    <td>{order.phone}</td>
                    <td>{order.age}</td>
                    <td>{order.course}</td>
                    <td>{order.format}</td>
                    <td>{order.type}</td>
                    <td>{order.sum ?? "null"}</td>
                    <td>{order.alreadyPaid ?? "null"}</td>
                    <td>{order.status ?? "null"}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Orders;