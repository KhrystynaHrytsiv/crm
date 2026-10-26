"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiUserSettingsLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";

import { RoleEnum } from "../../../../backend/src/enums/roleEnum";
import { logger } from "../../../../shared/logger";
import { useAppSelector } from "../../redux/hooks/reduxHooks";
import { authService } from "../../services/authService";
import css from "./Header.module.css";

const Header = () => {
    const { me } = useAppSelector((state) => state.manager);
    const router = useRouter();
    const logout = async () => {
        try {
            await authService.logout();
            router.push("/login");
        } catch (error) {
            logger.error(error, "Logout failed:");
        }
    };

    return (
        <header className={css.header}>
            <h1>
                <Link href={"/orders"}>Logo</Link>
            </h1>
            <div className={css.content}>
                {me && <p>{me.name}</p>}
                {me && me.role === RoleEnum.admin && (
                    <Link href={"/adminPanel"} className={css.icon}>
                        <RiUserSettingsLine size={"35px"} />
                    </Link>
                )}
                <div className={css.icon} onClick={logout}>
                    <TbLogout size={"35px"} />
                </div>
            </div>
        </header>
    );
};

export default Header;
