import joi from "joi";

export class PasswordValidator{
    private static password = joi.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s:])(\S){8,16}$/).message("At least 8 characters at least one uppercase letter and special symbol ");
    private static confirmPassword = joi.string().valid(joi.ref("password")).messages({"any.only": "Passwords do not match.",})
    public static passwordValid = joi.object({
        password: this.password.required(),
        confirmPassword: this.confirmPassword.required()
    })
}