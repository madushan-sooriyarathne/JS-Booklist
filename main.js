//Book class
class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// Storage Class
class Storage {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        }else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Storage.getBooks();
        books.push(book);
        // Put data back in to local Storage
        localStorage.setItem('books', JSON.stringify(books));
    }

    static deleteBook(isbn) {
        const books = Storage.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        // set new book list 
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//UI class
class UI{
    static displayBooks() {
        Storage.getBooks().forEach(book => UI.addBookToList(book));
    } 

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger tbn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, alertType) {
        const div = document.createElement('div');
        div.className = `alert alert-${alertType}`;
        div.appendChild(document.createTextNode(message));

        // Get the element to place this div
        const bookForm = document.querySelector('#book-form');

        //Place the div element
        bookForm.parentElement.insertBefore(div, bookForm);

        // Remove alert box in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}


//Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add book
document.querySelector('#book-form').addEventListener('submit', (event) => {

    //Prevent actual submit action
    event.preventDefault();

    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate inseted data
    if(title !== '' || author !== '' || isbn !== '') {
        //Create a new book object
        const book  = new Book(title, author, isbn);

        UI.addBookToList(book);

        //add book to local storage
        Storage.addBook(book);

        //Clear form fields after adding the book
        UI.clearFields();
        UI.showAlert('Book successfuly added to the list', 'success');
    } else {
        // Show error alert
        UI.showAlert('Please fill all the fields', 'danger');
    }
    
});


// Delete Book
document.querySelector('#book-list').addEventListener("click", event => {
    
    // Delete book from local storage
    const isbn = event.target.parentElement.previousElementSibling.textContent;
    Storage.deleteBook(isbn);
    
    //Delete book from UI
    UI.deleteBook(event.target);

    // Show the book deleted alert
    UI.showAlert('Successfuly deleted the book', 'success');
});