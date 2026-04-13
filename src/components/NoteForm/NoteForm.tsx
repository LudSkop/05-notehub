import css from "./NoteForm.module.css";

export default function NoteForm() {
  return (
    <div className={css.backdrop} role="dialog" aria-modal="true">
      <div className={css.modal}>{/* */}</div>
    </div>
  );
}
