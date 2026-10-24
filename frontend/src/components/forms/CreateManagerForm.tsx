import {useForm} from "react-hook-form";
import {fields} from "../../constants/createManagerFields";
import {IUserDto} from "../../interfaces/IUserDto";
import {managerService} from "../../services/managerService";
import {joiResolver} from "@hookform/resolvers/joi";
import {ManagerValidator} from "../../../../shared/validators/managerValidator";
import {managerAction} from "../../redux/slices/managerSlice";
import {useAppDispatch} from "../../redux/hooks/reduxHooks";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {getErrorMessage} from "../../helpers/getErrorMessage";


const CreateManagerForm = ({onClose}:{onClose:() => void}) => {
    const {register, handleSubmit, formState:{errors, isValid}} = useForm<IUserDto>({mode: "all", resolver:joiResolver(ManagerValidator.create)});
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const submit = async (dto:IUserDto) =>{
        try {
            setServerError(null);
            await managerService.createManager(dto);
            onClose();
            router.push('/adminPanel');
            await dispatch(managerAction.getManagers(1));
        }catch (e) {
            setServerError(getErrorMessage(e));
        }
    }
    return (
        <div className="overlay">
            <form onSubmit={handleSubmit(submit)} className="form">
                {fields.map(field =>
                <div key={field.name} className='field'>
                    <label htmlFor={field.name}>{field.label}</label>
                    <input type={field.type} {...register(field.name)} placeholder={field.placeholder}/>
                    {errors[field.name] && (<span className="error">{errors[field.name]?.message}</span>)}
                </div>)}
                {serverError && <span className="error">{serverError}</span>}
                <div className='buttonBlock'>
                <button type="button" className='greenButton' onClick={onClose}>Cancel</button>
                <button className='greenButton' disabled={!isValid}>Create</button>
                </div>
            </form>

        </div>
    );
};

export default CreateManagerForm;