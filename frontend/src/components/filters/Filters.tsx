import css from "./Filters.module.css"
import { TbReload } from "react-icons/tb";
import { LiaFileExcel } from "react-icons/lia";
const Filters = () => {
    return (
        <div className={css.container}>
            <div className={css.filters}>
            <input type="text" placeholder={'Name'} />
            <input type="text" placeholder={'Surname'}/>
            <input type="text" placeholder={'Email'}/>
            <input type="text" placeholder={'Phone'}/>
            <input type="text" placeholder={'Age'}/>
            <select>
                <option>all courses</option>
            </select>
            <select>
                <option>all formats</option>
            </select>
            <select>
                <option>all types</option>
            </select>
            <select>
                <option>all statuses</option>
            </select>
            <select>
                <option>all groups</option>
            </select>
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