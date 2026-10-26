import { useState } from "react";

import { useAppSelector } from "../../redux/hooks/reduxHooks";
import CreateManagerForm from "../forms/CreateManagerForm";
import Manager from "../manager/Manager";

const Admin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { managers } = useAppSelector((state) => state.manager);
    const { statistics } = useAppSelector((state) => state.orders);
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    fontSize: "17px",
                }}
            >
                <p>Order Statistic</p>
                <div>
                    {Object.entries(statistics).map(([key, value]) => (
                        <span key={key} style={{ margin: "5px" }}>
                            {key}: {value}
                        </span>
                    ))}
                </div>
            </div>
            <button className="greenButton" onClick={() => setIsOpen(true)}>
                Create
            </button>
            {isOpen && <CreateManagerForm onClose={() => setIsOpen(false)} />}
            {managers &&
                managers.map((manager) => (
                    <Manager
                        key={manager.manager._id}
                        managerWithStatistic={manager}
                    />
                ))}
        </div>
    );
};

export default Admin;
