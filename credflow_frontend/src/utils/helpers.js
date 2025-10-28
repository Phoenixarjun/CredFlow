/**
 * Formats a date string or Date object into a more readable format.
 * Example: '2025-10-27T10:30:00' -> '2025-10-27 10:30'
 * Handles potential invalid date inputs gracefully.
 *
 * @param {string | Date | null | undefined} dateInput - The date string or Date object to format.
 * @returns {string} - The formatted date string or 'Invalid Date'/'N/A'.
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) {
    return 'N/A'; // Or return an empty string, depending on preference
  }

  try {
    const date = new Date(dateInput);

    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Use Intl.DateTimeFormat for locale-aware formatting (recommended)
    // Adjust options as needed
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Use 24-hour format
    };
    // Example: 'en-CA' gives YYYY-MM-DD format, adjust locale as needed
    let formatted = new Intl.DateTimeFormat('en-CA', options).format(date);

    // Intl.DateTimeFormat might include commas or other separators depending on locale
    // Replace comma separator between date and time with a space if present
    formatted = formatted.replace(',', '');

    return formatted;

    /*
    // --- Alternative: Manual Formatting (less flexible) ---
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
    */
  } catch (error) {
    console.error("Error formatting date:", dateInput, error);
    return 'Invalid Date';
  }
};

// Add any other helper functions you might need here
// export const anotherHelper = () => { ... };