import {generalService} from "../../services/generalService";
import {IOrder} from '../../../../backend/src/interfaces/IOrder'
import Orders from "../../components/Orders";
import {IResPagination} from "../../../../backend/src/interfaces/IResPagination";

const OrdersPage = async() => {
    const {data} = await generalService.get<IResPagination<IOrder>>('/orders');
    return (
        <div>
            <Orders orders={data}/>
        </div>
    );
};

export default OrdersPage;