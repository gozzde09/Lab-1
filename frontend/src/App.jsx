import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AddBookForm from "./components/AddBookForm";
import EditBookForm from "./components/EditBookForm";

function App() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  // GET- Böcker med språk
  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      const data = await response.json();
      const sortedBooks = data.sort((a, b) => a.id - b.id);
      setBooks(sortedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // POST- Tillägga Bok
  const handleAddBook = async (newBook) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      const addedBook = await response.json();
      setBooks((prevBooks) => [...prevBooks, addedBook]);
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // DELETE -Book
  const handleDeleteBook = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this book?");
    if (confirmed) {
      try {
        await fetch(`/api/books/${id}`, { method: "DELETE" });
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  //EDIT -Bok och språk
  const handleUpdateBook = async (id, updatedBook) => {
    try {
      await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });
      fetchBooks();
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <div className='App'>
      <Header />
      <h1 className='mx-auto text-center fst-italic'>To-read Book list</h1>
      {/* Add Book Form */}
      <AddBookForm onAddBook={handleAddBook} />

      {/* Book List */}
      <Table className='my-4'>
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Book Title</th>
            <th>Author</th>
            <th>Literature</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <React.Fragment key={book.id}>
              <tr>
                <td>{index + 1}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.language}</td>
                <td className='text-center'>
                  <Button
                    className='mx-2'
                    variant='warning'
                    onClick={() => setEditingBook(book)}>
                    Edit
                  </Button>
                  <Button
                    className='mx-2'
                    variant='danger'
                    onClick={() => handleDeleteBook(book.id)}>
                    Delete
                  </Button>
                </td>
              </tr>

              {/* Edit Form Row */}
              {editingBook?.id === book.id && (
                <tr>
                  <td colSpan='5'>
                    <EditBookForm
                      book={editingBook}
                      onUpdate={handleUpdateBook}
                      onCancel={() => setEditingBook(null)}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
      <Footer />
    </div>
  );
}

export default App;
