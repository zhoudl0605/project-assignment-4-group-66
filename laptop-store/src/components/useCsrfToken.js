import { useEffect, useState } from 'react';

function useCsrfToken() {
    const [csrfToken, setCsrfToken] = useState('');
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch(`${baseUrl}/csrf-token`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error(`Failed to fetch CSRF Token: ${response.status}`);
                }

                const data = await response.json();
                if (!data.csrfToken) {
                    throw new Error('Invalid CSRF Token received');
                }

                setCsrfToken(data.csrfToken);
            } catch (err) {
                console.error('Error fetching CSRF Token:', err);
            }
        };

        fetchCsrfToken();
    }, [baseUrl]);

    return csrfToken
}

export default useCsrfToken;