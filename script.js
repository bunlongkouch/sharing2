let allBooks = [];

// Fetch all books from the "book_recommendations" collection
fetch('/api/books')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(books => {
        allBooks = books;
        console.log('Books:', books);
        displayBooks(books);
    })
    .catch(error => {
        console.error('Error fetching books:', error);
        const bookList = document.getElementById('bookList');
        bookList.innerHTML = '<p>Error loading books. Please try again later.</p>';
    });

// Fetch all books (from all collections) for search
let combinedBooks = [];
fetch('/api/all-books')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(books => {
        combinedBooks = books;
    })
    .catch(error => {
        console.error('Error fetching all books:', error);
    });

// Filter books by genre
document.getElementById('filterButton').addEventListener('click', () => {
    const genre = document.getElementById('genre').value;
    filterBooks(genre);
});

function filterBooks(genre) {
    let filteredBooks = allBooks;
    if (genre !== 'all') {
        filteredBooks = allBooks.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    }
    displayBooks(filteredBooks);
}

// Display books
function displayBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    if (books.length === 0) {
        bookList.innerHTML = '<p>No books found.</p>';
    } else {
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-card';
            bookElement.innerHTML = `
                <img src="${book.image || 'placeholder.jpg'}" alt="${book.title}">
                <h3>${book.title}</h3>
            `;
            bookElement.addEventListener('click', () => showBookDetails(book));
            bookList.appendChild(bookElement);
        });
    }
}

// Show book details
function showBookDetails(book) {
    const bookDetailsPage = document.getElementById('bookDetailsPage');
    const detailsBookImage = document.getElementById('detailsBookImage');
    const detailsBookTitle = document.getElementById('detailsBookTitle');
    const detailsBookAuthor = document.getElementById('detailsBookAuthor');
    const detailsBookGenre = document.getElementById('detailsBookGenre');
    const detailsBookPublishedDate = document.getElementById('detailsBookPublishedDate');
    const detailsBookSynopsis = document.getElementById('detailsBookSynopsis');

    detailsBookImage.src = book.image || 'placeholder.jpg';
    detailsBookTitle.textContent = book.title;
    detailsBookAuthor.textContent = book.author;
    detailsBookGenre.textContent = book.genre;
    detailsBookPublishedDate.textContent = book.publishedDate || 'N/A';
    detailsBookSynopsis.textContent = book.synopsis || 'No synopsis available.';

    bookDetailsPage.style.display = 'flex';
}

// Close book details page
document.getElementById('closeDetailsButton').addEventListener('click', () => {
    const bookDetailsPage = document.getElementById('bookDetailsPage');
    bookDetailsPage.style.display = 'none';
});

// Toggle search