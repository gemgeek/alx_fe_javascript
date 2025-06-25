// script.js

// Array to store quote objects. Each object will now also have an 'id'.
let quotes = [];
// Variable to track the selected category for filtering quotes
let selectedCategory = 'all'; // Default to show all categories

const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts';
const SYNC_INTERVAL_MS = 10000; // Sync every 10 seconds (adjust for testing)

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

// Load quotes from Local Storage or initialize with default quotes
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes, now with a unique local 'id' for easier tracking
        quotes = [
            { id: Date.now() + 1, text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { id: Date.now() + 2, text: "Believe you can and you're halfway there.", category: "Motivation" },
            { id: Date.now() + 3, text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { id: Date.now() + 4, text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Resilience" },
            { id: Date.now() + 5, text: "It is during our darkest moments that we must focus to see the light.", category: "Hope" }
        ];
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
    messageText.classList.remove('text-green-600', 'text-red-600', 'text-blue-600', 'text-yellow-600');

    if (type === 'success') {
        messageText.classList.add('text-green-600');
    } else if (type === 'error') {
        messageText.classList.add('text-red-600');
    } else if (type === 'warning') {
        messageText.classList.add('text-yellow-600');
    } else {
        messageText.classList.add('text-blue-600');
    }
    messageBox.classList.remove('hidden');
}

closeMessageBox.addEventListener('click', () => {
    messageBox.classList.add('hidden');
});


function showRandomQuote() {
    const filteredQuotes = quotes.filter(quote =>
        selectedCategory === 'all' || quote.category === selectedCategory
    );

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category. Try adding some!";
        quoteCategory.textContent = "";
        sessionStorage.removeItem('lastViewedQuote');
        sessionStorage.removeItem('lastViewedCategory');
        updateLastViewedQuoteDisplay();
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteDisplay.textContent = `"${randomQuote.text}"`;
    quoteCategory.textContent = `- ${randomQuote.category}`;

    sessionStorage.setItem('lastViewedQuote', randomQuote.text);
    sessionStorage.setItem('lastViewedCategory', randomQuote.category);

    updateLastViewedQuoteDisplay();
}

function createAddQuoteForm() {
    addQuoteFormContainer.innerHTML = '';
    addQuoteFormContainer.classList.add('p-6', 'bg-blue-50', 'rounded-lg', 'shadow-md');

    const form = document.createElement('form');
    form.id = 'addQuoteForm';
    form.classList.add('space-y-4');

    const quoteLabel = document.createElement('label');
    quoteLabel.htmlFor = 'newQuoteText';
    quoteLabel.textContent = 'New Quote:';
    quoteLabel.classList.add('block', 'text-gray-700', 'font-semibold', 'mb-1');

    const quoteTextarea = document.createElement('textarea');
    quoteTextarea.id = 'newQuoteText';
    quoteTextarea.rows = 4;
    quoteTextarea.placeholder = 'Enter your inspirational quote here...';
    quoteTextarea.classList.add('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition', 'duration-200', 'shadow-sm');
    quoteTextarea.required = true;

    const categoryLabel = document.createElement('label');
    categoryLabel.htmlFor = 'newQuoteCategory';
    categoryLabel.textContent = 'Category:';
    categoryLabel.classList.add('block', 'text-gray-700', 'font-semibold', 'mb-1', 'mt-4');

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'newQuoteCategory';
    categoryInput.placeholder = 'e.g., Motivation, Wisdom, Life';
    categoryInput.classList.add('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-md', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition', 'duration-200', 'shadow-sm');
    categoryInput.required = true;

    const addBtn = document.createElement('button');
    addBtn.type = 'submit';
    addBtn.textContent = 'Add Quote';
    addBtn.classList.add('w-full', 'bg-blue-600', 'hover:bg-blue-700', 'text-white', 'font-semibold', 'py-3', 'px-4', 'rounded-lg', 'shadow-md', 'transition', 'duration-300', 'ease-in-out', 'transform', 'hover:scale-105', 'mt-6');

    form.appendChild(quoteLabel);
    form.appendChild(quoteTextarea);
    form.appendChild(categoryLabel);
    form.appendChild(categoryInput);
    form.appendChild(addBtn);

    addQuoteFormContainer.appendChild(form);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const newText = quoteTextarea.value.trim();
        const newCategory = categoryInput.value.trim();

        if (newText && newCategory) {
            // Create a new quote object with a unique local ID
            const newQuote = {
                id: `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Unique local ID
                text: newText,
                category: newCategory
            };

            quotes.push(newQuote); // Add new quote to the array
            saveQuotes(); // Save the updated array to Local Storage

            quoteTextarea.value = '';
            categoryInput.value = '';

            displayMessageBox('Quote added successfully! Will attempt to sync.', 'success');
            populateCategories(); // Update categories dropdown
            showRandomQuote();
            // Trigger an immediate sync after adding a new quote
            syncQuotesWithServer();
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
 * Imported quotes are given a temporary local ID if they don't have one.
 * @param {Event} event - The file input change event.
 */
function importFromJsonFile(event) {
    const fileReader = new FileReader();

    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                // Assign temporary local IDs to imported quotes if they don't have one
                const quotesToAdd = importedQuotes.map(q => ({
                    id: q.id || `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    text: q.text,
                    category: q.category
                }));
                quotes.push(...quotesToAdd);
                saveQuotes();
                displayMessageBox('Quotes imported successfully! Will attempt to sync.', 'success');
                populateCategories();
                showRandomQuote();
                // Trigger an immediate sync after importing
                syncQuotesWithServer();
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

function populateCategories() {
    const uniqueCategories = ['all', ...new Set(quotes.map(quote => quote.category))];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    uniqueCategories.forEach(category => {
        if (category !== 'all') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }
    });

    const lastFilter = localStorage.getItem('lastSelectedCategory');
    if (lastFilter && uniqueCategories.includes(lastFilter)) {
        selectedCategory = lastFilter;
        categoryFilter.value = lastFilter;
    } else {
        selectedCategory = 'all';
        categoryFilter.value = 'all';
    }
}


function filterQuotes() {
    selectedCategory = categoryFilter.value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    showRandomQuote();
}


async function syncQuotesWithServer() {
    displayMessageBox('Syncing with server...', 'info');
    try {
        const response = await fetch(MOCK_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = await response.json();

        
        const serverQuotes = serverData.slice(0, 10).map(item => ({ 
            id: `server-${item.id}`, 
            text: item.title,
            category: item.body.split(' ')[0] 
        }));

        let newQuotesAdded = 0;
        let quotesUpdated = 0;
        let conflictsResolved = 0;

        
        const localQuotesMap = new Map(quotes.map(q => [q.id, q]));

        
        serverQuotes.forEach(sQuote => {
            const existingLocalQuote = localQuotesMap.get(sQuote.id);

            if (existingLocalQuote) {
                
                if (existingLocalQuote.text !== sQuote.text || existingLocalQuote.category !== sQuote.category) {
                    existingLocalQuote.text = sQuote.text;
                    existingLocalQuote.category = sQuote.category;
                    quotesUpdated++;
                    conflictsResolved++;
                }
            } else {
                // New quote from server, add it
                quotes.push(sQuote);
                newQuotesAdded++;
            }
        });

    
        const localOnlyQuotes = quotes.filter(q => q.id && q.id.startsWith('local-'));
        if (localOnlyQuotes.length > 0) {
        
        }


        saveQuotes(); 
        populateCategories(); 
        showRandomQuote(); 

        let syncMessage = 'Sync completed.';
        if (newQuotesAdded > 0 || quotesUpdated > 0) {
            syncMessage += ` ${newQuotesAdded} new quotes, ${quotesUpdated} updated.`;
            if (conflictsResolved > 0) {
                syncMessage += ` (${conflictsResolved} conflicts resolved - server precedence).`;
            }
            displayMessageBox(syncMessage, 'success');
        } else {
            displayMessageBox('Sync completed. No new quotes or updates.', 'info');
        }


    } catch (error) {
        displayMessageBox(`Sync failed: ${error.message}. Please check your internet connection.`, 'error');
        console.error("Error during sync:", error);
    }
}

// --- Event Listeners ---

newQuoteBtn.addEventListener('click', showRandomQuote);
showAddQuoteFormBtn.addEventListener('click', createAddQuoteForm);
exportQuotesBtn.addEventListener('click', exportQuotesToJson);
importJsonFile.addEventListener('change', importFromJsonFile);
categoryFilter.addEventListener('change', filterQuotes);

// Initialize the application when the DOM is fully loaded

document.addEventListener('DOMContentLoaded', () => {
    loadQuotes(); 
    populateCategories(); 
    filterQuotes(); 
    updateLastViewedQuoteDisplay(); 

    setInterval(syncQuotesWithServer, SYNC_INTERVAL_MS);
    // Also perform an initial sync when the page loads
    syncQuotesWithServer();
});
