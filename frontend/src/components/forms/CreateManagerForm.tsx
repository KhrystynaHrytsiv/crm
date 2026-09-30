import {useForm} from "react-hook-form";
import {fields} from "../../constants/createManagerFields";
import {IUserDto} from "../../interfaces/IUserDto";
import {managerService} from "../../services/managerService";
import {joiResolver} from "@hookform/resolvers/joi";
import {ManagerValidator} from "../../../../backend/src/validators/managerValidator";


const CreateManagerForm = ({onClose}:{onClose:() => void}) => {
    const {register, handleSubmit, formState:{errors, isValid}} = useForm<IUserDto>({mode: "all", resolver:joiResolver(ManagerValidator.create)});
    const submit = async (dto:IUserDto) =>{
        try {
            await managerService.createManager(dto);
            onClose()
        }catch (e) {
            console.log(e);
        }
    }
    return (
        <div className="overlay">
            <form onSubmit={handleSubmit(submit)}>
                {fields.map(field =>
                <div key={field.name} className='field'>
                    <label htmlFor={field.name}>{field.label}</label>
                    <input type={field.type} {...register(field.name)} placeholder={field.placeholder}/>
                    {errors[field.name] && (<span className="error">{errors[field.name]?.message}</span>)}
                </div>)}
                <div className='buttonBlock'>
                <button className='greenButton' onClick={onClose}>Cancel</button>
                <button className='greenButton' disabled={!isValid}>Create</button>
                </div>
            </form>

        </div>
    );
};

export default CreateManagerForm;