"use client"
import css from "./Filters.module.css"
import {TbReload} from "react-icons/tb";
import {LiaFileExcel} from "react-icons/lia";
import {useRouter, useSearchParams} from "next/navigation";
import {filters, inputs} from "../../constants/filters";
import {useEffect, useRef, useState} from "react";
import {useAppSelector} from "../../redux/hooks/reduxHooks";
import {orderService} from "../../services/orderService";

const Filters = () => {
    const [isDateFocused, setIsDateFocused] = useState(false);
    const {me} = useAppSelector(state =>state.manager);
    const {groups} = useAppSelector(state => state.orders);
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    const allFilters = filters(groups);

    const getTextValues = () => Object.fromEntries(inputs.map(({key}) => [key, searchParams.get(key) || ""]));
    const [textValues, setTextValues] = useState<Record<string, string>>(getTextValues);
    const searchParamsString = searchParams.toString();
    const [syncedParams, setSyncedParams] = useState(searchParamsString);
    if (syncedParams !== searchParamsString) {
        setSyncedParams(searchParamsString);
        setTextValues(getTextValues());
    }

    const handleFilterChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(window.location.search);
        newParams.delete("page");
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        router.push(`/orders?${newParams.toString()}`);
    };
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }, []);
    const handleInputChange = (key: string, value: string) => {
            setTextValues((prev) => ({...prev, [key]: value}));
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                handleFilterChange(key, value.trim());
            }, 500);
    };

    const createExcel = async ()=>{
        try{
            params.delete("page");
            params.delete("pageSize");
            const blob = await orderService.getExcelFile(params);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "orders.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }catch (e) {
            console.log(e);
        }
    }
    return (
        <div className={css.container}>
            <div className={css.filters}>
                {inputs.map((input) =>
                    (<input type={'text'} key={input.key} placeholder={input.label} value={textValues[input.key] ?? ""}
                            onChange={(e) => handleInputChange(input.key, e.target.value)}/>))}
                {allFilters.map((filter) => (
                    <select key={filter.key} value={searchParams.get(filter.key) || ""}
                            onChange={(e) => handleFilterChange(filter.key, e.target.value)}>
                        <option value="">{filter.placeholder}</option>
                        {filter.options.map((option: string) => (
                            <option key={option} value={option}>{option}</option>))}
                    </select>)
                )}
                <input type={isDateFocused ? "date" : "text"} placeholder="Start date"
                    value={searchParams.get("start_date") || ""} onFocus={() => setIsDateFocused(true)}
                    onChange={(e) => handleFilterChange("start_date", e.target.value)}/>

                <input type={isDateFocused ? "date" : "text"} value={searchParams.get("end_date") || ""} placeholder={"End date"}
                       onFocus={() => setIsDateFocused(true)} onChange={(e) => handleFilterChange("end_date", e.target.value)}/>
            </div>
            <div className={css.info}>
                <label>
                    {me &&
                    <input type="checkbox" checked={searchParams.get("my") === "true"}
                           onChange={(e) => handleFilterChange("my", e.target.checked ? "true" : "")}/> }
                    My
                </label>
                <div className={css.icon} onClick={()=>{
                    if (timer.current) {
                        clearTimeout(timer.current);
                    }
                    router.push('/orders');
                }}>
                    <TbReload size={"25px"} color={"white"}/>
                </div>
                <div className={css.icon}>
                    <LiaFileExcel size={"25px"} color={"white"} onClick={createExcel}/>
                </div>
            </div>

        </div>
    );
};

export default Filters;