import {IQuery} from "../../../shared/interfaces/IQuery";
import {orderRepository} from "../repositories/orderRepository";
import {IOrder, OrderDTO} from "../../../shared/interfaces/IOrder";
import {apiError} from "../error/apiError";
import {StatusCode} from "../enums/StatusCode";
import {CourseStatusEnum} from "../enums/courseStatusEnum";
import ExcelJS from "exceljs";
import {IResPagination} from "../../../shared/interfaces/IResPagination";
import {columns} from "../../../shared/constance/orders";

class OrderService {
    async getAll(query:IQuery):Promise<IResPagination<IOrder>>{
        const [data, totalItems] = await orderRepository.getAll(query);
        const totalPages = Math.ceil(totalItems/query.pageSize);
        return {
            totalItems,
            totalPages,
            prevPage: !!(query.page - 1),
            nextPage: query.page < totalPages,
            data,
        };
    }
    async getGroups():Promise<string[]>{
        return await orderRepository.getGroups();
    }
    async getById(id:string):Promise<IOrder>{
        const order = await orderRepository.getById(id);
        if(!order){
            throw new apiError("Order not found", StatusCode.NOT_FOUND)
        }
        return order;
    }
    async update(id: string, dto: Partial<OrderDTO>, userId:string): Promise<IOrder> {
        const order = await this.getById(id);
        const updateData = dto.status === CourseStatusEnum.new
            ? { ...dto, manager: null }
            : { ...dto, manager: userId };

        const updatedOrder = await orderRepository.update(order._id, updateData);
        if (!updatedOrder) {
            throw new apiError("Order not found", StatusCode.NOT_FOUND);
        }
        return updatedOrder;
    }
    async getStatistics(){
        return orderRepository.getStatistics()
    }
    async createExcelSheet(query: IQuery): Promise<ExcelJS.Buffer> {
        const orders = await orderRepository.getDataForExcel(query);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Report");
        worksheet.columns = [...columns];
        for (const order of orders) {
            const row = columns.map(({ key }) => {
                switch (key) {
                    case "status":
                        return order.status ?? "new";
                    case "created_at":
                        return order.created_at
                            ? new Date(order.created_at).toLocaleString("uk-UA") : "";
                    case "manager":
                        return typeof order.manager === "object" && order.manager
                            ? order.manager.surname : "";
                    default:
                        return order[key];
                }
            });

            worksheet.addRow(row);
        }
        const headerRow = worksheet.getRow(1);
        headerRow.font = {bold: true, color: { argb: "FFFFFFFF" }};
        headerRow.fill = {type: "pattern", pattern: "solid", fgColor: { argb: "FF76B852" }};
        headerRow.alignment = {vertical: "middle", horizontal: "center"};
        worksheet.views = [{ state: "frozen", ySplit: 1 }];
        worksheet.eachRow({ includeEmpty: true }, (row) => {
            for (let col = 1; col <= columns.length; col++) {
                const cell = row.getCell(col);
                cell.alignment = {horizontal: "center", vertical: "middle", wrapText: true};
                cell.border = {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                };
                cell.font = {...cell.font, size: 14};
            }
        });
        return workbook.xlsx.writeBuffer();
    }
}
export const orderService = new OrderService();