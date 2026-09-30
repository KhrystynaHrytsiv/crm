"use client";
import {useForm} from "react-hook-form";
import {IAuth} from "../../../../backend/src/interfaces/IAuth";
import {authService} from "../../services/authService";
import {useRouter} from "next/navigation";
import {useState} from "react";
import axios from "axios";

const Login =  () => {
    const {handleSubmit, register, formState:{ isValid}} = useForm<IAuth>({mode: "onSubmit",});
    const [serverError, setServerError] = useState(null);
    const router = useRouter();
    const login = async (formData:IAuth) =>{
        try {
            await authService.login(formData);
            router.push("/orders");
        }catch (e) {
            if (axios.isAxiosError(e)) {
                setServerError(e.response?.data?.message || "Something went wrong");
            }
        }
    }
    return (
        <form onSubmit={handleSubmit(login)}>
            <div className="field" style={{width: "220px"}}>
                <label htmlFor={'email'}>Email</label>
                <input type={"text"} {...register('email')} placeholder={"Email"}/>
            </div>
            <div className="field" style={{width: "220px"}}>
                <label htmlFor={'password'}>Password</label>
                <input type={"password"} {...register('password')} placeholder={"Password"}/>
                {serverError && <div className="error">{serverError}</div>}
            </div>
            <button disabled={!isValid} className='wide-button'>Login</button>
        </form>
    );
};

export default Login;