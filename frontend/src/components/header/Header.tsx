"use client";
import {TbLogout} from "react-icons/tb";
import {RiUserSettingsLine} from "react-icons/ri";
import css from "./Header.module.css";
import {authService} from "../../services/authService";
import {useRouter} from "next/navigation";
import {IUser} from "../../../../backend/src/interfaces/IUser";
import {RoleEnum} from "../../../../backend/src/enums/roleEnum";

const Header = ({me}: {me:IUser}) => {
    const router = useRouter();
    const logout = async() =>{
        try {
            await authService.logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <header className={css.header}>
            <h1>Logo</h1>
            <div className={css.content}>
                <p>{me.name}</p>
                {me.role === RoleEnum.admin &&
                    <div className={css.icon} onClick={()=>router.push('/adminPanel')}>
                    <RiUserSettingsLine size={"35px"}/></div>}
                <div className={css.icon} onClick={logout}><TbLogout size={"35px"} /></div>
            </div>
        </header>
    );
};

export default Header;