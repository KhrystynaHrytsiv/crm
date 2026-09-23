"use client";
import {TbLogout} from "react-icons/tb";
import {RiUserSettingsLine} from "react-icons/ri";
import css from "./Header.module.css";
import {authService} from "../../services/authService";
import {useRouter} from "next/navigation";

const Header = () => {
    const router = useRouter();
    const logout = async() =>{
        try {
            await authService.logout();
            router.push("/auth/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
    return (
        <header className={css.header}>
            <h1>Logo</h1>
            <div className={css.content}>
                <p></p>
                <div className={css.icon}><RiUserSettingsLine size={"35px"} enableBackground={"green"}/></div>
                <div className={css.icon} onClick={logout}><TbLogout size={"35px"} /></div>
            </div>
        </header>
    );
};

export default Header;