import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const AddBookForm = ({ onAddBook }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [languages, setLanguages] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBook = { title, author, language_id: languageId };
    onAddBook(newBook);
    resetForm();
  };
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setLanguageId("");
  };

  return (
    <Form onSubmit={handleSubmit} className='d-flex align-items-center'>
      <input
        className='m-2 form-control'
        type='text'
        placeholder='Book Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className='m-2 form-control'
        type='text'
        placeholder='Author'
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <select
        className='m-2 form-select'
        value={languageId}
        onChange={(e) => setLanguageId(e.target.value)}
        required>
        <option value=''>Select Language</option>
        {languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}
          </option>
        ))}
      </select>
      <Button className='mx-2 p-1' variant='success' type='submit'>
        Add
      </Button>
    </Form>
  );
};
AddBookForm.propTypes = {
  onAddBook: PropTypes.func.isRequired,
};

export default AddBookForm;
