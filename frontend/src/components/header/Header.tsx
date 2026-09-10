import { TbLogout } from "react-icons/tb";
import { RiUserSettingsLine } from "react-icons/ri";
import css from "./Header.module.css";
const Header = () => {
    return (
        <header className={css.header}>
            <h1>Logo</h1>
            <div className={css.content}>
                <p>admin</p>
                <div className={css.icon}>
                    <RiUserSettingsLine size={"50px"} enableBackground={"green"}/>
                </div>
                <div className={css.icon}>
                    <TbLogout size={"50px"} />
                </div>

            </div>
        </header>
    );
};

export default Header;