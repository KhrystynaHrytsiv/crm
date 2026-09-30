import joi from "joi";

export class PasswordValidator{
    private static password = joi.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s:])(\S){8,16}$/).messages({"string.regex": "At least 8 characters at least one upper letter and special symbol "
        })
    public static passwordValid = joi.object({
        password: this.password.required()
    })
}