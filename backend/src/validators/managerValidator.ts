import joi from "joi";

export class ManagerValidator {
    private static name = joi.string().min(2).max(25);
    private static surname = joi.string().min(2).max(25);
    private static email = joi.string().email();

    public static create = joi.object({
        name: this.name.required(),
        surname: this.surname.required(),
        email: this.email.required(),
    })
}