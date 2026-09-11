"use client"
import css from "./Filters.module.css"
import {TbReload} from "react-icons/tb";
import {LiaFileExcel} from "react-icons/lia";
import {useRouter, useSearchParams} from "next/navigation";
import {filters, inputs} from "../../constants/filters";

const Filters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

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
                {inputs.map((input) =>(<input type={'text'} key={input.key} placeholder={input.label} onChange={(e) =>handleFilterChange(input.key, e.target.value)}/>))}
                {filters.map((filter) => (
                    <select key={filter.key} value={searchParams.get(filter.key) || ""}
                            onChange={(e) => handleFilterChange(filter.key, e.target.value)}>
                        <option value="">{filter.label}</option>
                        {filter.options.map((option) => (<option key={option} value={option}>{option}</option>))}
                    </select>
                ))}
            </div>
            <div className={css.info}>
                <label>
                <input type={"checkbox"} />
                    My
                </label>
                <div className={css.icon}>
                    <TbReload size={"35px"} color={"white"}/>
                </div>
                <div className={css.icon}>
                    <LiaFileExcel size={"35px"} color={"white"}/>
                </div>
            </div>

        </div>
    );
};

export default Filters;