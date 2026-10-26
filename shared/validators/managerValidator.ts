import joi from "joi";

export class ManagerValidator {
    private static nameField = joi.string().min(2).max(25).messages({
        "string.min": "At least 2 letters",
        "string.max": "Not more than 25 characters",
    });
    private static surname = joi.string().min(2).max(25).messages({
        "string.min": "At least 2 letters",
        "string.max": "Not more than 25 characters",
    });
    private static email = joi
        .string()
        .email()
        .messages({ "string.email": "Enter a valid email address" });

    public static create = joi.object({
        name: this.nameField.required(),
        surname: this.surname.required(),
        email: this.email.required(),
    });
}
