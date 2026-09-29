"use client";
import {useForm} from "react-hook-form";
import {IAuth} from "../../../../backend/src/interfaces/IAuth";
import {authService} from "../../services/authService";
import {useRouter} from "next/navigation";

const Login =  () => {
    const {handleSubmit, register, formState:{errors, isValid}} = useForm<IAuth>({mode: "onSubmit",});
    const router = useRouter();
    const login = async (formData:IAuth) =>{
        await authService.login(formData);
        router.push("/orders");
    }
    return (
        <form onSubmit={handleSubmit(login)}>
            <div className="field">
                <label htmlFor={'email'}>Email</label>
                <input type={"text"} {...register('email')} placeholder={"Email"}/>
                {errors.email && <div>{errors.email.message}</div>}
            </div>
            <div className="field">
                <label htmlFor={'password'}>Password</label>
                <input type={"password"} {...register('password')} placeholder={"Password"}/>
                {errors.password && <div>{errors.password.message}</div>}
            </div>
            <button disabled={!isValid} className='wide-button'>Login</button>
        </form>
    );
};

export default Login;