"use client";
import {TbLogout} from "react-icons/tb";
import {RiUserSettingsLine} from "react-icons/ri";
import css from "./Header.module.css";
import {authService} from "../../services/authService";
import {useRouter} from "next/navigation";
import {RoleEnum} from "../../../../backend/src/enums/roleEnum";
import Link from "next/link";
import {useAppSelector} from "../../redux/hooks/reduxHooks";

const Header = () => {
    const {me} = useAppSelector(state =>state.manager);
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
            <h1><Link href={'/orders'}>Logo</Link></h1>
            <div className={css.content}>
                {me && <p>{me.name}</p>}
                {me && me.role === RoleEnum.admin &&
                    <Link href={'/adminPanel'} className={css.icon}><RiUserSettingsLine size={"35px"}/></Link>}
                <div className={css.icon} onClick={logout}><TbLogout size={"35px"} /></div>
            </div>
        </header>
    );
};

export default Header;