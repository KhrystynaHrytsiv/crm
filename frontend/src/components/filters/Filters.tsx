"use client"
import css from "./Filters.module.css"
import {TbReload} from "react-icons/tb";
import {LiaFileExcel} from "react-icons/lia";
import {useRouter, useSearchParams} from "next/navigation";
import {Filter, filters, inputs} from "../../constants/filters";
import {useState} from "react";
import {useAppSelector} from "../../redux/hooks/reduxHooks";

const Filters = () => {
    const [isDateFocused, setIsDateFocused] = useState(false);
    const {me} = useAppSelector(state =>state.auth);
    const {groups} = useAppSelector(state => state.orders);
    const router = useRouter();
    const searchParams = useSearchParams();
    const allFilters = filters(groups);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/orders?${params.toString()}`);
    };

    return (
        <div className={css.container}>
            <div className={css.filters}>
                {inputs.map((input) =>
                    (<input type={'text'} key={input.key} placeholder={input.label}
                            onChange={(e) => handleFilterChange(input.key, e.target.value)}/>))}
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
                    <input type="checkbox" checked={searchParams.get("manager") === me.surname}
                           onChange={(e) =>{handleFilterChange("manager", e.target.checked ? me.surname : "")}}/> }
                    My
                </label>
                <div className={css.icon} onClick={()=>router.push('/orders')}>
                    <TbReload size={"25px"} color={"white"}/>
                </div>
                <div className={css.icon}>
                    <LiaFileExcel size={"25px"} color={"white"}/>
                </div>
            </div>

        </div>
    );
};

export default Filters;