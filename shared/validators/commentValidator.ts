import joi from "joi";

export class CommentValidator {
    public static comment = joi.object({
        comment: joi.string().trim().min(1).message("Min 1 char").required(),
    });
}
