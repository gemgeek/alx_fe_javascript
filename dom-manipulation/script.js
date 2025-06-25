// script.js

let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Resilience" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "Hope" }
];

// Get references to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const showAddQuoteFormBtn = document.getElementById('showAddQuoteFormBtn');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');

function showRandomQuote() {
    // Generate a random index based on the length of the quotes array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    // Get the quote object at the random index
    const randomQuote = quotes[randomIndex];

    // Update the text content of the quote display and category elements
    quoteDisplay.textContent = `"${randomQuote.text}"`;
    quoteCategory.textContent = `- ${randomQuote.category}`;
}

function createAddQuoteForm() {
    // Clear any existing content in the container to prevent duplicate forms
    addQuoteFormContainer.innerHTML = '';
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
    categoryLabel.classList.add('block', 'text-gray-700', 'font-semibold', 'mb-1', 'mt-4'); // Added mt-4 for spacing

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
        // Prevent default form submission behavior (which would reload the page)
        event.preventDefault();

        // Get values from the input fields
        const newText = quoteTextarea.value.trim();
        const newCategory = categoryInput.value.trim();

        // Basic validation
        if (newText && newCategory) {
            // Create a new quote object
            const newQuote = {
                text: newText,
                category: newCategory
            };

            // Add the new quote to our quotes array
            quotes.push(newQuote);

            quoteTextarea.value = ''; // Clear textarea
            categoryInput.value = ''; // Clear input field

            // Display confirmation message
            const confirmationMsg = document.createElement('p');
            confirmationMsg.textContent = 'Quote added successfully!';
            confirmationMsg.classList.add('text-green-600', 'text-center', 'font-semibold', 'mt-4');
            addQuoteFormContainer.appendChild(confirmationMsg);

            // Remove confirmation message after a few seconds
            setTimeout(() => {
                confirmationMsg.remove();
            }, 3000); // 3 seconds

            showRandomQuote(); 
        } else {
            alert('Please enter both a quote and a category.');
        }
    });
}

// --- Event Listeners ---

// Event listener for the "Show New Quote" button
newQuoteBtn.addEventListener('click', showRandomQuote);

// Event listener for the "Add New Quote" button
showAddQuoteFormBtn.addEventListener('click', createAddQuoteForm);


// --- Initial Setup ---

// Display an initial random quote when the page loads
document.addEventListener('DOMContentLoaded', showRandomQuote);
