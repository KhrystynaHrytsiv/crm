import Joi from "joi";

export class AuthValidator {
    public static login = Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().required(),
    });
}
