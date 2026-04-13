import css from "./App.module.css";
import { NoteList } from "../NoteList/NoteList";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import { keepPreviousData } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import { useState } from "react";

export default function App() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteNote, // викликає deleteNote(id)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // оновлює список
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page], // ключ з номером сторінки
    queryFn: () => fetchNotes({ page }), // передаємо номер сторінки
    placeholderData: keepPreviousData,
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <p>Error</p>;
  const notes = data?.notes ?? [];

  return (
    <>
      <div className={css.app}>
        {data?.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <header className={css.toolbar}>
          {notes.length > 0 && (
            <NoteList notes={notes} onDelete={handleDelete} />
          )}

          {/* Компонент SearchBox */}
          {/* Пагінація */}
          {/* Кнопка створення нотатки */}
        </header>
      </div>
    </>
  );
}
