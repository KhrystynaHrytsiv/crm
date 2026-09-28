import {useForm} from "react-hook-form";
import {fields} from "../constants/createManagerFields";
import {IUserDto} from "../interfaces/IUserDto";
import {managerService} from "../services/managerService";



const CreateManagerForm = ({onClose}:{onClose:() => void}) => {
    const {register, handleSubmit} = useForm<IUserDto>();
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
                </div>)}
                <div className='buttonBlock'>
                <button className='greenButton' onClick={onClose}>Cancel</button>
                <button className='greenButton'>Create</button>
                </div>
            </form>

        </div>
    );
};

export default CreateManagerForm;