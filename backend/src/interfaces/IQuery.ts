export interface IQuery {
    page: number;
    pageSize: number;
    order?:string;
    name?:string;
    surname?:string;
    email?:string;
    phone?:string;
    age?:number;

}