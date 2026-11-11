import Joi from "joi";

export class AuthValidator {
    public static login = Joi.object({
        email: Joi.string().trim().lowercase().email().required(),
        password: Joi.string().required(),
    });
}
