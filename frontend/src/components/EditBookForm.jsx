import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

function EditBookForm({ book, onUpdate, onCancel }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [languageId, setLanguageId] = useState(book.language_id);
  const [languages, setLanguages] = useState([]);
  // console.log(languageId);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/languages");
        const data = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    const updatedBook = { title, author, language_id: languageId };
    onUpdate(book.id, updatedBook);
  };

  return (
    <div>
      <Form onSubmit={handleEdit} className='d-flex align-items-center'>
        <input
          className='mx-2'
          type='text'
          placeholder='Book Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className='mx-2'
          type='text'
          placeholder='Author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <select
          className='mx-2'
          value={languageId}
          onChange={(e) => setLanguageId(e.target.value)}
          required>
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </select>
        <Button className='mx-2 p-1' type='submit' variant='success'>
          Update
        </Button>
        <Button
          className='mx-2 p-1'
          type='button'
          variant='danger'
          onClick={onCancel}>
          Cancel
        </Button>
      </Form>
    </div>
  );
}

EditBookForm.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    language_id: PropTypes.number.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditBookForm;
