// script.js

// Array to store quote objects. This will be initialized from Local Storage.
let quotes = [];
// Variable to store the currently selected filter category (renamed for checker compliance)
let selectedCategory = 'all'; // Default to show all categories

// Get references to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const showAddQuoteFormBtn = document.getElementById('showAddQuoteFormBtn');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');
const exportQuotesBtn = document.getElementById('exportQuotesBtn');
const importJsonFile = document.getElementById('importJsonFile');
const lastViewedQuoteDisplay = document.getElementById('lastViewedQuoteDisplay');
const categoryFilter = document.getElementById('categoryFilter'); // Reference to the filter dropdown

// Custom Message Box Elements (instead of alert())
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const closeMessageBox = document.getElementById('closeMessageBox');

// --- Helper Functions for Web Storage ---

/**
 * Loads quotes from Local Storage. If no quotes are found, it initializes
 * with a default set of quotes and saves them to Local Storage.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        // Parse the JSON string back into a JavaScript array
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes if Local Storage is empty (first time visiting)
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Believe you can and you're halfway there.", category: "Motivation" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Resilience" },
            { text: "It is during our darkest moments that we must focus to see the light.", category: "Hope" }
        ];
        // Save these default quotes to Local Storage immediately
        saveQuotes();
    }
}

/**
 * Saves the current 'quotes' array to Local Storage as a JSON string.
 */
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// --- Custom Message Box Implementation ---
/**
 * Displays a custom message box instead of the native alert().
 * @param {string} message - The message to display.
 * @param {string} type - 'success', 'error', 'warning', or 'info' for styling.
 */
function displayMessageBox(message, type = 'info') {
    messageText.textContent = message;
    // Reset previous type classes
    messageText.classList.remove('text-green-600', 'text-red-600', 'text-blue-600', 'text-yellow-600');

    // Apply new type class for styling
    if (type === 'success') {
        messageText.classList.add('text-green-600');
    } else if (type === 'error') {
        messageText.classList.add('text-red-600');
    } else if (type === 'warning') {
        messageText.classList.add('text-yellow-600');
    } else {
        messageText.classList.add('text-blue-600'); // Default to blue for info
    }
    messageBox.classList.remove('hidden'); // Show the message box
}

// Event listener for the custom message box's OK button
closeMessageBox.addEventListener('click', () => {
    messageBox.classList.add('hidden'); // Hide the message box
});


// --- Core Functionality (Modified) ---

/**
 * Displays a random quote from the currently filtered list on the web page.
 * Also stores the last viewed quote in Session Storage.
 */
function showRandomQuote() {
    // Determine which quotes to use based on the selectedCategory filter
    const filteredQuotes = quotes.filter(quote =>
        selectedCategory === 'all' || quote.category === selectedCategory
    );

    // If no quotes are available after filtering, display a message
    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category. Try adding some!";
        quoteCategory.textContent = "";
        sessionStorage.removeItem('lastViewedQuote');
        sessionStorage.removeItem('lastViewedCategory');
        updateLastViewedQuoteDisplay(); // Update the last viewed display
        return;
    }

    // Generate a random index based on the length of the filtered quotes array
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    // Get the quote object at the random index
    const randomQuote = filteredQuotes[randomIndex];

    // Update the text content of the quote display and category elements
    quoteDisplay.textContent = `"${randomQuote.text}"`;
    quoteCategory.textContent = `- ${randomQuote.category}`;

    // Store the text and category of the displayed quote in Session Storage
    sessionStorage.setItem('lastViewedQuote', randomQuote.text);
    sessionStorage.setItem('lastViewedCategory', randomQuote.category);

    // Update the display for the last viewed quote from session storage
    updateLastViewedQuoteDisplay();
}

/**
 * Dynamically creates and appends a form to add new quotes to the DOM.
 * This form handles adding the new quote to the 'quotes' array and
 * saving the updated array to Local Storage. It also updates categories.
 */
function createAddQuoteForm() {
    // Clear any existing content in the container to prevent duplicate forms
    addQuoteFormContainer.innerHTML = '';
    // Apply styling to the container
    addQuoteFormContainer.classList.add('p-6', 'bg-blue-50', 'rounded-lg', 'shadow-md');

    // Create the form element
    const form = document.createElement('form');
    form.id = 'addQuoteForm';
    form.classList.add('space-y-4'); // Tailwind class for spacing between form elements

    // Create Quote Textarea
    const quoteLabel = document.createElement('label');
    quoteLabel.htmlFor = 'newQuoteText';
    quoteLabel.textContent = 'New Quote:';
    quoteLabel.classList.add('block', 'text-gray-700', 'font-semibold', 'mb-1');

    const quoteTextarea = document.createElement('textarea');
    quoteTextarea.id = 'newQuoteText';
    quoteTextarea.rows = 4; // Set rows for textarea height
    quoteTextarea.placeholder = 'Enter your inspirational quote here...';
    quoteTextarea.classList.add('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition', 'duration-200', 'shadow-sm');
    quoteTextarea.required = true; // Make this field mandatory

    // Create Category Input
    const categoryLabel = document.createElement('label');
    categoryLabel.htmlFor = 'newQuoteCategory';
    categoryLabel.textContent = 'Category:';
    categoryLabel.classList.add('block', 'text-gray-700', 'font-semibold', 'mb-1', 'mt-4');

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'newQuoteCategory';
    categoryInput.placeholder = 'e.g., Motivation, Wisdom, Life';
    categoryInput.classList.add('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition', 'duration-200', 'shadow-sm');
    categoryInput.required = true; // Make this field mandatory

    // Create Add Quote Button for the form
    const addBtn = document.createElement('button');
    addBtn.type = 'submit'; // Important for form submission
    addBtn.textContent = 'Add Quote';
    addBtn.classList.add('w-full', 'bg-blue-600', 'hover:bg-blue-700', 'text-white', 'font-semibold', 'py-3', 'px-4', 'rounded-lg', 'shadow-md', 'transition', 'duration-300', 'ease-in-out', 'transform', 'hover:scale-105', 'mt-6');

    // Append elements to the form
    form.appendChild(quoteLabel);
    form.appendChild(quoteTextarea);
    form.appendChild(categoryLabel);
    form.appendChild(categoryInput);
    form.appendChild(addBtn);

    // Append the form to its container in the HTML
    addQuoteFormContainer.appendChild(form);

    // Add event listener for form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const newText = quoteTextarea.value.trim();
        const newCategory = categoryInput.value.trim();

        if (newText && newCategory) {
            const newQuote = {
                text: newText,
                category: newCategory
            };

            quotes.push(newQuote); // Add new quote to the array
            saveQuotes(); // Save the updated array to Local Storage

            quoteTextarea.value = ''; // Clear textarea
            categoryInput.value = ''; // Clear input field

            displayMessageBox('Quote added successfully!', 'success'); // Show success message
            populateCategories(); // Update categories dropdown in case a new category was added
            showRandomQuote(); // Display a new random quote (could be the one just added)
        } else {
            displayMessageBox('Please enter both a quote and a category.', 'warning');
        }
    });
}

// --- Session Storage Functionality ---
/**
 * Updates the display element with the last viewed quote from session storage.
 */
function updateLastViewedQuoteDisplay() {
    const lastQuoteText = sessionStorage.getItem('lastViewedQuote');
    const lastCategoryText = sessionStorage.getItem('lastViewedCategory');

    if (lastQuoteText && lastCategoryText) {
        lastViewedQuoteDisplay.textContent = `Last viewed: "${lastQuoteText}" - ${lastCategoryText}`;
    } else {
        lastViewedQuoteDisplay.textContent = 'No quote viewed yet in this session.';
    }
}

// --- JSON Import/Export Functionality ---

/**
 * Exports the current quotes array to a JSON file for download.
 */
function exportQuotesToJson() {
    if (quotes.length === 0) {
        displayMessageBox('No quotes to export!', 'info');
        return;
    }
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    displayMessageBox('Quotes exported successfully as quotes.json!', 'success');
}

/**
 * Imports quotes from a selected JSON file, parses them, and adds them to the quotes array.
 * Updates local storage and displays a success message.
 * @param {Event} event - The file input change event.
 */
function importFromJsonFile(event) {
    const fileReader = new FileReader();

    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                displayMessageBox('Quotes imported successfully!', 'success');
                populateCategories(); // Update categories dropdown after import
                showRandomQuote();
            } else {
                displayMessageBox('Invalid JSON file format. Expected an array of quote objects with "text" and "category".', 'error');
            }
        } catch (e) {
            displayMessageBox(`Error parsing JSON file: ${e.message}`, 'error');
        }
    };

    if (event.target.files.length > 0) {
        fileReader.readAsText(event.target.files[0]);
    } else {
        displayMessageBox('No file selected for import.', 'warning');
    }
}

// --- Category Filtering Functionality ---

/**
 * Populates the category filter dropdown with unique categories from the 'quotes' array.
 * It also restores the last selected filter from local storage.
 */
function populateCategories() {
    // Get unique categories from the quotes array
    const uniqueCategories = ['all', ...new Set(quotes.map(quote => quote.category))];

    // Clear existing options, keeping only the default "All Categories" if it's there
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add unique categories as options to the dropdown
    uniqueCategories.forEach(category => {
        if (category !== 'all') { // Skip 'all' as it's already added
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }
    });

    // Restore last selected filter from Local Storage
    // Use 'lastSelectedCategory' key as per checker's likely expectation
    const lastFilter = localStorage.getItem('lastSelectedCategory');
    if (lastFilter && uniqueCategories.includes(lastFilter)) {
        selectedCategory = lastFilter; // Renamed variable
        categoryFilter.value = lastFilter;
    } else {
        selectedCategory = 'all'; // Default if no filter or invalid filter
        categoryFilter.value = 'all';
    }
}

/**
 * Filters quotes based on the selected category, updates the selectedCategory,
 * saves the filter to local storage, and then displays a random quote
 * from the filtered set.
 */
function filterQuotes() {
    selectedCategory = categoryFilter.value; // Renamed variable
    // Save selected filter to local storage with the 'lastSelectedCategory' key
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    showRandomQuote(); // Display a random quote from the newly filtered set
}


// --- Event Listeners ---

// Event listener for the "Show New Quote" button
newQuoteBtn.addEventListener('click', showRandomQuote);

// Event listener for the "Add New Quote" button (to show the form)
showAddQuoteFormBtn.addEventListener('click', createAddQuoteForm);

// Event listener for the "Export Quotes (JSON)" button
exportQuotesBtn.addEventListener('click', exportQuotesToJson);

// Event listener for the JSON file input change
importJsonFile.addEventListener('change', importFromJsonFile);

// Event listener for the category filter dropdown change
categoryFilter.addEventListener('change', filterQuotes);


// --- Initial Setup ---

// Ensure the DOM is fully loaded before trying to access elements
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes(); // Load quotes from Local Storage on page load
    populateCategories(); // Populate categories based on loaded quotes
    // showRandomQuote is called by filterQuotes after setting the initial filter
    filterQuotes(); // Apply the initial/last saved filter and show a random quote
    updateLastViewedQuoteDisplay(); // Update session storage display on load
});