import css from "./Pagination.module.css";
import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";

// 2. Описуємо тип що це об'єкт з .default
type ModuleWithDefault<T> = { default: T };

// 3. Витягуємо сам компонент з .default
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

interface ReactPaginateProps {
  pageCount: number;
  pageRangeDisplayed?: number;
  marginPagesDisplayed?: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  forcePage?: number;
  containerClassName?: string;
  activeClassName?: string;
  nextLabel?: string;
  previousLabel?: string;
}

interface PaginationProps {
  totalPages: number; // загальна кількість сторінок
  currentPage: number; // поточна сторінка
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
