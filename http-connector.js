// http-connector.js
export async function connectToSite(url, options = {}) {
    // Default options for the HTTP request
    const defaultOptions = {
        method: "GET", // Default to GET
        headers: {},   // Default headers
        body: null     // Default no body
    };

    // Merge provided options with default options
    const requestOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, requestOptions);

        // Check for HTTP error codes
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and return the response
        // Adjust to `response.text()` or `response.blob()` if needed
        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error in HTTP request:", error);
        throw error;
    }
}

// Example Usage:
(async () => {
    try {
        // Example: GET Request
        const getData = await connectToSite('https://jsonplaceholder.typicode.com/posts/1');
        console.log("GET Response:", getData);

        // Example: POST Request
        const postData = {
            title: 'foo',
            body: 'bar',
            userId: 1
        };
        const postResponse = await connectToSite('https://jsonplaceholder.typicode.com/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });
        console.log("POST Response:", postResponse);

    } catch (error) {
        console.error("HTTP operations failed:", error);
    }
})();
