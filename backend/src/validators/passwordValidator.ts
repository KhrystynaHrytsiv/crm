import joi from "joi";

export class PasswordValidator{
    private static password = joi.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s:])(\S){8,16}$/)

    public static passwordValid = joi.object({
        password: this.password.required()
    })
}