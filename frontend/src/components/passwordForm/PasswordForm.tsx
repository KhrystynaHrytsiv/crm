import { joiResolver } from "@hookform/resolvers/joi";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import css from "./PasswordForm.module.css"
import { ActionTokenType } from "../../../../shared/enums/tokenEnum";
import { PasswordValidator } from "../../../../shared/validators/passwordValidator";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { managerService } from "../../services/managerService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface IFormData {
    password: string;
    confirmPassword: string;
}

const PasswordForm = ({
    token,
    action,
}: {
    token: string;
    action: ActionTokenType;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormData>({
        mode: "all",
        resolver: joiResolver(PasswordValidator.passwordFormValid),
    });
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const submit = async (dto: IFormData) => {
        try {
            setServerError(null);
            await managerService.actionComplete(action, token, dto.password);
            router.push("/login");
        } catch (e) {
            const error = e as { response?: { status?: number } };
            if (error.response?.status === 400) {
                router.push("/invalid-link");
                return;
            }
            setServerError(getErrorMessage(e));
        }
    };
    return (
        <form onSubmit={handleSubmit(submit)} className="form">
            <div className="field">
                <label htmlFor={"password"}>Password</label>
                <div className={css.passwordWrapper}>
                    <input type={showPassword ? "text" : "password"} {...register("password")} />
                    <button type="button" className={css.passwordToggle}
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ?  <FaEye /> :<FaEyeSlash /> }
                    </button>
                </div>
                {errors.password?.message && (
                    <div className="error">{errors.password.message}</div>
                )}
            </div>
            <div className="field">
                <label htmlFor={"confirmPassword"}>Confirm password</label>
                <div className={css.passwordWrapper}>
                    <input type={showConfirmPassword ? "text":"password"} {...register("confirmPassword")} />
                    <button type="button" className={css.passwordToggle}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>

                </div>
                {errors.confirmPassword?.message && (
                    <div className="error">
                        {errors.confirmPassword.message}
                    </div>
                )}
            </div>
            {serverError && <div className="error">{serverError}</div>}
            <button className="wi   de-button">
                {action === ActionTokenType.activate
                    ? "Activate"
                    : "Recovery Password"}
            </button>
        </form>
    );
};

export default PasswordForm;
