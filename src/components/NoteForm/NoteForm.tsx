import css from "./NoteForm.module.css";
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};
interface NoteFormProps {
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => void;
  isLoading: boolean;
  error: Error | null;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Too short")
    .max(50, "Too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Too long").required("Content is required"),
  tag: Yup.string().required("Tag is required"),
});

export default function NoteForm({
  onClose,
  onSubmit,
  isLoading,
  error,
}: NoteFormProps) {
  const handleSubmit = (
    values: NoteFormValues,
    octions: FormikHelpers<NoteFormValues>,
  ) => {
    console.log(values);
    onSubmit(values); // ✅ викликає createNote з App
    octions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" onClick={onClose} className={css.cancelButton}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create note"}
            Create note
          </button>
        </div>
        {error && (
          <p className={css.error}>Something went wrong. Please try again.</p>
        )}
      </Form>
    </Formik>
  );
}
