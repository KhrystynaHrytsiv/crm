import { joiResolver } from "@hookform/resolvers/joi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ActionTokenType } from "../../../../backend/src/enums/tokenEnum";
import { PasswordValidator } from "../../../../shared/validators/passwordValidator";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { managerService } from "../../services/managerService";

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
    const submit = async (dto: IFormData) => {
        try {
            setServerError(null);
            await managerService.actionComplete(action, token, dto.password);
            router.push("/login");
        } catch (e) {
            setServerError(getErrorMessage(e));
        }
    };
    return (
        <form onSubmit={handleSubmit(submit)} className="form">
            <div className="field">
                <label htmlFor={"password"}>Password</label>
                <input type={"password"} {...register("password")} />
                {errors.password?.message && (
                    <div className="error">{errors.password.message}</div>
                )}
            </div>
            <div className="field">
                <label htmlFor={"confirmPassword"}>Confirm password</label>
                <input type={"password"} {...register("confirmPassword")} />
                {errors.confirmPassword?.message && (
                    <div className="error">
                        {errors.confirmPassword.message}
                    </div>
                )}
            </div>
            {serverError && <div className="error">{serverError}</div>}
            <button className="wide-button">
                {action === ActionTokenType.activate
                    ? "Activate"
                    : "Recovery Password"}
            </button>
        </form>
    );
};

export default PasswordForm;
