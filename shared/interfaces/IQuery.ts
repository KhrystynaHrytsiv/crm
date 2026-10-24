export interface IQuery {
    page: number;
    pageSize: number;
    order?:string;
    name?:string;
    surname?:string;
    email?:string;
    phone?:string;
    age?:number;
    course?:string,
    course_format?:string,
    course_type?:string,
    status?:string,
    start_date?: string;
    end_date?: string;
    group?:string;
    my?:string;
}