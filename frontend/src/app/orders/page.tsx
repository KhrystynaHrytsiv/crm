import {generalService} from "../../services/generalService";
import {IOrder} from "../../../../backend/src/interfaces/IOrder";
import {IResPagination} from "../../../../backend/src/interfaces/IResPagination";
import Orders from "../../components/orders/Orders";
import Filters from "../../components/filters/Filters";
import Header from "../../components/header/Header";

type SearchParams = Record<string, string | undefined>;

const OrdersPage = async ({searchParams}: { searchParams: Promise<SearchParams>}) => {
    const params = await searchParams;
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => { //перетворює з об'єкту на масив
        if (value !== undefined) {
            query.set(key, value);
        }
    });

    const { data } = await generalService.get<IResPagination<IOrder>>(`/orders?${query.toString()}`);
    return (
        <div>
            <Header/>
            <Filters/>
            <Orders orders={data} />
        </div>
    );
};

export default OrdersPage;
