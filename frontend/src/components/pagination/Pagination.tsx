"use client";
import {useRouter, useSearchParams} from "next/navigation";
import {useAppSelector} from "../../redux/hooks/reduxHooks";
import css from "./Pagination.module.css";
import {MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight} from "react-icons/md";

const Pagination = () => {
    const { totalPages, prevPage, nextPage } = useAppSelector(state => state.orders);
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) {
            return;
        }
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`?${params.toString()}`);
    };

    let pages: number[] = [];
    if (totalPages <= 7) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 4) {
        pages = Array.from({ length: 7 }, (_, i) => i + 1);
    } else if (currentPage >= totalPages - 4) {
        pages = Array.from({ length: 7 }, (_, i) => totalPages - 6 + i);
    } else {
        pages = Array.from({ length: 5 }, (_, i) => currentPage - 2 + i);
    }

    const showLeftDots = pages[0] > 2;
    const showRightDots = pages[pages.length - 1] < totalPages - 1;

    return (
        <nav aria-label="Orders pagination" className={css.paginationBlock}>
            {prevPage && <MdOutlineKeyboardArrowLeft onClick={() => goToPage(currentPage - 1)} className={css.arrow} aria-label="Prev page"/>}
            {showLeftDots && (
                <>
                    <button onClick={() => goToPage(1)} className={css.button}>1</button>
                    <div className={css.button}>...</div>
                </>
            )}

            {pages.map((page) => (
                <button key={page} type="button" onClick={() => goToPage(page)}
                        className={`${css.button} ${page === currentPage ? css.active : ""}`}
                    aria-current={page === currentPage ? "page" : undefined} disabled={page === currentPage}>
                    {page}
                </button>
            ))}

            {showRightDots && <div className={css.button}>...</div>}
            {pages[pages.length - 1] < totalPages && (
                <button onClick={() => goToPage(totalPages)} className={css.button}>{totalPages}</button>
            )}
            {nextPage && <MdOutlineKeyboardArrowRight onClick={() => goToPage(currentPage + 1)} className={css.arrow} aria-label="Next page"/>}
        </nav>
    );
};

export default Pagination;