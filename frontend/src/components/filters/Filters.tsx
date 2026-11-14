import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LiaFileExcel } from "react-icons/lia";
import { MdFilterAltOff } from "react-icons/md";
import { TbReload } from "react-icons/tb";

import { logger } from "../../../../shared/logger";
import { filters, inputs } from "../../constants/filters";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { orderActions } from "../../redux/slices/ordersSlice";
import { orderService } from "../../services/orderService";
import css from "./Filters.module.css";

type TimerMap = Record<string, ReturnType<typeof setTimeout>>;

const Filters = () => {
    const { me } = useAppSelector((state) => state.manager);
    const { groups } = useAppSelector((state) => state.orders);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const allFilters = filters(groups.map((group) => group.name));
    const [isDateFocused, setIsDateFocused] = useState(false);
    const [exportError, setExportError] = useState("");
    const getTextValues = () =>
        Object.fromEntries(
            inputs.map(({ key }) => [key, searchParams.get(key) || ""]),
        );

    const [textState, setTextState] = useState(() => ({
        query: searchParams.toString(),
        values: getTextValues(),
    }));

    const textValues =
        textState.query === searchParams.toString()
            ? textState.values
            : getTextValues();
    const timers = useRef<TimerMap>({});
    const paramsRef = useRef(new URLSearchParams(searchParams.toString()));

    const clearTimers = () => {
        Object.values(timers.current).forEach(clearTimeout);
        timers.current = {};
    };
    useEffect(() => {
        return () => {
            Object.values(timers.current).forEach(clearTimeout);
        };
    }, []);

    useEffect(() => {
        paramsRef.current = new URLSearchParams(searchParams.toString());
    }, [searchParams]);
    useEffect(() => {
        const handlePopState = () => {
            clearTimers();
            const params = new URLSearchParams(
                window.location.search,
            );
            paramsRef.current = params;
            setTextState({
                query: params.toString(),
                values: Object.fromEntries(
                    inputs.map(({ key }) => [
                        key,
                        params.get(key) || "",
                    ]),
                ),
            });
        };
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);
    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(paramsRef.current);
            params.set("page", "1");
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            paramsRef.current = params;
            router.push(`/orders?${params.toString()}`);
        },
        [router],
    );

    const handleInputChange = (key: string, value: string) => {
        setTextState({
            query: searchParams.toString(),
            values: {
                ...textValues,
                [key]: value,
            },
        });
        if (timers.current[key]) {
            clearTimeout(timers.current[key]);
        }
        timers.current[key] = setTimeout(() => {
            handleFilterChange(key, value.trim());
            delete timers.current[key];
        }, 500);
    };

    const reloadOrders = () => {
        dispatch(orderActions.getOrders({ query: searchParams.toString() }));
    };

    const resetFilters = () => {
        clearTimers();
        setTextState({
            query: "",
            values: Object.fromEntries(inputs.map(({ key }) => [key, ""])),
        });
        paramsRef.current = new URLSearchParams();
        if (searchParams.toString()) {
            router.push("/orders");
        } else {
            reloadOrders();
        }
    };

    const createExcel = async () => {
        try {
            setExportError("");
            const params = new URLSearchParams(searchParams.toString());
            params.delete("page");
            params.delete("pageSize");
            const blob = await orderService.getExcelFile(params);
            if (!(blob instanceof Blob) || blob.size === 0) {
                throw new Error(
                    "Excel-файл порожній або не вдалося його сформувати.",
                );
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "orders.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            logger.error(error);
            setExportError(
                "Не вдалося завантажити Excel-файл. Спробуйте ще раз.",
            );
        }
    };
    return (
        <div className={css.container}>
            <div className={css.filters}>
                {inputs.map((input) => (
                    <input
                        type={"text"}
                        key={input.key}
                        placeholder={input.label}
                        value={textValues[input.key] ?? ""}
                        onChange={(e) =>
                            handleInputChange(input.key, e.target.value)
                        }
                    />
                ))}
                {allFilters.map((filter) => (
                    <select
                        key={filter.key}
                        value={searchParams.get(filter.key) || ""}
                        onChange={(e) =>
                            handleFilterChange(filter.key, e.target.value)
                        }
                    >
                        <option value="">{filter.placeholder}</option>
                        {filter.options.map((option: string) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ))}
                <input
                    type={isDateFocused ? "date" : "text"}
                    placeholder="Start date"
                    value={searchParams.get("start_date") || ""}
                    onFocus={() => setIsDateFocused(true)}
                    onChange={(e) =>
                        handleFilterChange("start_date", e.target.value)
                    }
                />

                <input
                    type={isDateFocused ? "date" : "text"}
                    value={searchParams.get("end_date") || ""}
                    placeholder={"End date"}
                    onFocus={() => setIsDateFocused(true)}
                    onChange={(e) =>
                        handleFilterChange("end_date", e.target.value)
                    }
                />
            </div>
            <div className={css.info}>
                <label>
                    {me && (
                        <input
                            type="checkbox"
                            checked={searchParams.get("manager") === "true"}
                            onChange={(e) =>
                                handleFilterChange(
                                    "manager",
                                    e.target.checked ? "true" : "",
                                )
                            }
                        />
                    )}
                    My
                </label>
                <button
                    className={css.icon}
                    onClick={resetFilters}
                    title="Reset filters"
                >
                    <MdFilterAltOff size={"25px"} color={"white"} />
                </button>
                <button
                    className={css.icon}
                    onClick={reloadOrders}
                    title="Refresh list"
                >
                    <TbReload size={"25px"} color={"white"} />
                </button>
                <button className={css.icon}  onClick={createExcel} title="Create excel file">
                    <LiaFileExcel size={"25px"} color={"white"} />
                </button>
                {exportError && (
                    <p className={css.error} role="alert">
                        {exportError}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Filters;
