import { IUserDto } from "../interfaces/IUserDto";

export const fields: {
    name: keyof IUserDto;
    label: string;
    type: string;
    placeholder: string;
}[] = [
    {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Email",
    },
    {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Name",
    },
    {
        name: "surname",
        label: "Surname",
        type: "text",
        placeholder: "Surname",
    },
];
