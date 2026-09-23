"use client";
import {useForm} from "react-hook-form";
import {IAuth} from "../../../../backend/src/interfaces/IAuth";
import {authService} from "../../services/authService";
import {useRouter} from "next/navigation";


const Login =  () => {
    const {handleSubmit, register} = useForm<IAuth>();
    const router = useRouter();
    const login = async (formData:IAuth) =>{
        await authService.login(formData);
        router.push("/orders");
    }
    return (
        <form onSubmit={handleSubmit(login)}>
            <input type={"text"} {...register('email')}/>
            <input type={"password"} {...register('password')}/>
            <button>Login</button>
        </form>
    );
};

export default Login;