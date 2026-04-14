import css from "./App.module.css";
import { NoteList } from "../NoteList/NoteList";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchNotes, deleteNote, createNote } from "../../services/noteService";
import { keepPreviousData } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import { useState } from "react";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";

export default function App() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 3000);

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteNote, // викликає deleteNote(id)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // оновлює список
    },
  });
  // Створення нотатки
  const {
    mutate: handleCreateNote,
    isPending,
    error: mutationError,
  } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, search], // ключ з номером сторінки
    queryFn: () => fetchNotes({ page, search }), // передаємо номер сторінки
    placeholderData: keepPreviousData,
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <p>Error</p>;
  const notes = data?.notes ?? [];

  return (
    <>
      <div className={css.app}>
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <header className={css.toolbar}>
          <SearchBox
            value={inputValue}
            onChange={(value) => {
              setInputValue(value);
              debouncedSearch(value);
            }}
          />
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <NoteForm
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateNote}
                isLoading={isPending}
                error={mutationError}
              />
            </Modal>
          )}
        </header>
        {notes.length > 0 && <NoteList notes={notes} onDelete={handleDelete} />}
      </div>
    </>
  );
}
