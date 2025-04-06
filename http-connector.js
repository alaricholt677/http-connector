export async function advancedHttpConnector(url, options = {}) {
    const defaultOptions = {
        method: "GET",          // Default HTTP method
        headers: {},            // Default headers
        body: null,             // Default request body
        timeout: 5000,          // Timeout in milliseconds
        ignoreErrors: true      // Option to ignore errors and force content
    };

    const requestOptions = { ...defaultOptions, ...options };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout);

        const fetchOptions = {
            ...requestOptions,
            cache: "no-store",     // Avoid cache to ensure fresh data
            credentials: "include",// Include credentials for authenticated endpoints
            signal: controller.signal
        };

        // Fetch data
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        // Check response status
        if (!response.ok) {
            if (requestOptions.ignoreErrors) {
                console.warn(`HTTP Error ${response.status} ignored. Proceeding with fallback.`);
                return null; // Allows iframe or fallback mechanisms to proceed
            }
            throw new Error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
        }

        // Handle and parse data
        const contentType = response.headers.get("Content-Type");
        if (contentType?.includes("application/json")) {
            return await response.json(); // Handle JSON data
        } else if (contentType?.includes("text")) {
            return await response.text(); // Handle text data
        } else if (contentType?.includes("application/octet-stream") || contentType?.includes("blob")) {
            return await response.blob(); // Handle binary data
        } else {
            return await response.arrayBuffer(); // Handle array buffers
        }
    } catch (error) {
        if (error.name === "AbortError") {
            console.error("Request timed out. Consider increasing the timeout.");
            throw new Error("Request timed out.");
        }

        // Force content to load regardless of subframe errors
        if (requestOptions.ignoreErrors) {
            console.warn(`Subframe Error ignored. Proceeding.`);
            return null; // Prevent breaking functionality
        }
        throw new Error(`Failed to fetch: ${error.message}`);
    }
}
