'use client';
import {useParams} from "next/navigation";
import PasswordForm from "../../../components/forms/PasswordForm";
import {ActionTokenType} from "../../../../../backend/src/enums/tokenEnum";

const ActionPage = () => {
    const {token, action} = useParams<{ token: string; action: ActionTokenType}>();
    return (
        <div className="container">
            <PasswordForm token={token} action={action}/>
        </div>
    );
};

export default ActionPage;