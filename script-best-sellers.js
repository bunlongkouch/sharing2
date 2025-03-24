let allBooks = [];
let combinedBooks = [];

// Fetch best sellers from the "best-sellers" collection
fetch('/api/best-sellers')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(books => {
        allBooks = books; // Store all books for filtering
        console.log('Best Sellers:', books); // Log the data
        displayBooks(books);
    })
    .catch(error => {
        console.error('Error fetching best sellers:', error); // Log the error
        const bookList = document.getElementById('bookList');
        bookList.innerHTML = '<p>Error loading books. Please try again later.</p>';
    });

// Fetch all books (from all collections) for search
fetch('/api/all-books')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(books => {
        combinedBooks = books; // Store all books for search
        console.log('Combined Books:', combinedBooks); // Log the combined books
    })
    .catch(error => {
        console.error('Error fetching all books:', error); // Log the error
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
        console.log('No books found for the search query.'); // Log a message if no books are found
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

    // Populate book details
    detailsBookImage.src = book.image || 'placeholder.jpg';
    detailsBookTitle.textContent = book.title;
    detailsBookAuthor.textContent = book.author;
    detailsBookGenre.textContent = book.genre;
    detailsBookPublishedDate.textContent = book.publishedDate || 'N/A';
    detailsBookSynopsis.textContent = book.synopsis || 'No synopsis available.';

    // Show the book details page
    bookDetailsPage.style.display = 'flex';
}

// Close book details page
document.getElementById('closeDetailsButton').addEventListener('click', () => {
    const bookDetailsPage = document.getElementById('bookDetailsPage');
    bookDetailsPage.style.display = 'none';
});

// Toggle search input
const searchColon = document.getElementById('searchColon');
const searchText = document.getElementById('searchText');
const searchInput = document.getElementById('searchInput');

searchColon.addEventListener('click', () => {
    searchText.style.display = 'none'; // Hide "Quick Search" text
    searchInput.style.display = 'block'; // Show input field
    searchInput.focus(); // Focus on the input field
});

// Handle search input
searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const genre = document.getElementById('genre').value;
    console.log('Search Query:', query); // Log the search query
    filterAndSearchBooks(query, genre);
});

function filterAndSearchBooks(query, genre) {
    let filteredBooks;

    if (query === '') {
        // If the search query is empty, revert to the current page's books (allBooks)
        filteredBooks = allBooks;
    } else {
        // If there's a search query, use combinedBooks for searching across all collections
        if (combinedBooks.length === 0) {
            console.log('Combined books not yet loaded.'); // Log a message if combinedBooks is empty
            return; // Exit the function if combinedBooks is not populated
        }
        filteredBooks = combinedBooks;
    }

    // Apply genre filter
    if (genre !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    }

    // Apply search query filter (if query is not empty)
    if (query !== '') {
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(query) || // Search by title
            book.author.toLowerCase().includes(query)   // Search by author
        );
    }

    console.log('Filtered Books:', filteredBooks); // Log the filtered books for debugging
    displayBooks(filteredBooks);
}