import {useForm} from "react-hook-form";
import {ActionTokenType} from "../../../../backend/src/enums/tokenEnum";
import {managerService} from "../../services/managerService";
import {useRouter} from "next/navigation";
import {joiResolver} from "@hookform/resolvers/joi";
import {PasswordValidator} from "../../../../backend/src/validators/passwordValidator";

interface IFormData{
    password:string,
    confirmPassword:string
}

const PasswordForm = ({token, action}: {token:string, action: ActionTokenType}) => {
    const {register, handleSubmit, formState:{errors}} = useForm<IFormData>({mode: "all", resolver:joiResolver(PasswordValidator.passwordFormValid)});
    const router = useRouter();
    const submit = async (dto:IFormData) =>{
        try{
            await managerService.actionComplete(action, token, dto.password);
            router.push('/login')
        }catch (e) {
            console.log(e);
        }
    }
    return (
        <form onSubmit={handleSubmit(submit)} className="form">
            <div className="field">
                <label htmlFor={'password'}>Password</label>
                <input type={'password'} {...register('password')}/>
                {errors.password?.message && <div className="error">{errors.password.message}</div>}
            </div>
            <div className="field">
                <label htmlFor={'confirmPassword'}>Confirm password</label>
                <input type={'password'} {...register('confirmPassword')}/>
                {errors.confirmPassword?.message && <div className="error">{errors.confirmPassword.message}</div>}
            </div>
            <button className="wide-button">
                {action === ActionTokenType.activate ? "Activate" : "Recovery Password"}</button>
        </form>
    );
};

export default PasswordForm;