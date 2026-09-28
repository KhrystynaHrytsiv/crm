import {useForm} from "react-hook-form";
import {ActionTokenType} from "../../../backend/src/enums/tokenEnum";
import {managerService} from "../services/managerService";
import {useRouter} from "next/navigation";

interface IFormData{
    password:string,
    confirmPassword:string
}

const PasswordForm = ({token, action}: {token:string, action: ActionTokenType}) => {
    const {register, handleSubmit} = useForm<IFormData>();
    const router = useRouter();
    const submit = async (dto:IFormData) =>{
        if (dto.password !== dto.confirmPassword){
            throw new Error('Passwords do not match');
        }
        try{
            await managerService.actionComplete(action, token, dto.password);
            router.push('/login')
        }catch (e) {
            console.log(e);
        }
    }
    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="field">
                <label htmlFor={'password'}>Password</label>
                <input type={'password'} {...register('password')}/>
            </div>
            <div className="field">
                <label htmlFor={'confirmPassword'}>Confirm password</label>
                <input type={'password'} {...register('confirmPassword')}/>
            </div>
            <button className={'greenButton'}>
                {action === ActionTokenType.activate ? "Activate" : "Recovery Password"}</button>
        </form>
    );
};

export default PasswordForm;