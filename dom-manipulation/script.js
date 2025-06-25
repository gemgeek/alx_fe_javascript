// script.js

let quotes = [];

// Get references to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const showAddQuoteFormBtn = document.getElementById('showAddQuoteFormBtn');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');
const exportQuotesBtn = document.getElementById('exportQuotesBtn');
const importJsonFile = document.getElementById('importJsonFile');
const lastViewedQuoteDisplay = document.getElementById('lastViewedQuoteDisplay');

// Custom Message Box Elements (instead of alert())
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const closeMessageBox = document.getElementById('closeMessageBox');

// --- Helper Functions for Web Storage ---

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
    messageBox.classList.add('hidden'); 
});


// --- Core Functionality (Modified) ---

function showRandomQuote() {
    // If there are no quotes, display a message and clear session storage
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Add some!";
        quoteCategory.textContent = "";
        sessionStorage.removeItem('lastViewedQuote');
        sessionStorage.removeItem('lastViewedCategory');
        updateLastViewedQuoteDisplay(); // Update the last viewed display
        return;
    }

    // Generate a random index based on the length of the quotes array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    // Get the quote object at the random index
    const randomQuote = quotes[randomIndex];

    // Update the text content of the quote display and category elements
    quoteDisplay.textContent = `"${randomQuote.text}"`;
    quoteCategory.textContent = `- ${randomQuote.category}`;

    // Store the text and category of the displayed quote in Session Storage
    sessionStorage.setItem('lastViewedQuote', randomQuote.text);
    sessionStorage.setItem('lastViewedCategory', randomQuote.category);

    // Update the display for the last viewed quote from session storage
    updateLastViewedQuoteDisplay();
}

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
    addBtn.type = 'submit'; 
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
        event.preventDefault(); 

        const newText = quoteTextarea.value.trim();
        const newCategory = categoryInput.value.trim();

        if (newText && newCategory) {
            const newQuote = {
                text: newText,
                category: newCategory
            };

            quotes.push(newQuote); 
            saveQuotes(); 

            quoteTextarea.value = ''; 
            categoryInput.value = ''; 

            displayMessageBox('Quote added successfully!', 'success'); // Show success message
            showRandomQuote(); // Display a new random quote (could be the one just added)
        } else {
            displayMessageBox('Please enter both a quote and a category.', 'warning');
        }
    });
}

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

function exportQuotesToJson() {
    if (quotes.length === 0) {
        displayMessageBox('No quotes to export!', 'info');
        return;
    }
    // Convert the quotes array to a JSON string with pretty formatting
    const dataStr = JSON.stringify(quotes, null, 2);
    // Create a Blob object from the JSON string with the specified MIME type
    const blob = new Blob([dataStr], { type: 'application/json' });
    // Create a URL for the Blob object. This URL can be used as a download link.
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element (<a>)
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
                // Add imported quotes to the existing array
                quotes.push(...importedQuotes);
                saveQuotes(); 
                displayMessageBox('Quotes imported successfully!', 'success');
                showRandomQuote();
            } else {
                displayMessageBox('Invalid JSON file format. Expected an array of quote objects with "text" and "category".', 'error');
            }
        } catch (e) {
            displayMessageBox(`Error parsing JSON file: ${e.message}`, 'error');
        }
    };

    // Check if a file was selected
    if (event.target.files.length > 0) {
        fileReader.readAsText(event.target.files[0]); 
    } else {
        displayMessageBox('No file selected for import.', 'warning');
    }
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


document.addEventListener('DOMContentLoaded', () => {
    loadQuotes(); 
    showRandomQuote(); 
    updateLastViewedQuoteDisplay(); 
});
