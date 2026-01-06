// Blue Mountain Travel - API Client
// ⚠️ WARNING: This client connects to intentionally vulnerable backend APIs

const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000/api'
    : '/api';

// ⚠️ VULNERABILITY: API client with no authentication
class APIClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        console.log('API Client initialized:', this.baseURL);
    }

    // Generic fetch wrapper
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log(`API Request: ${options.method || 'GET'} ${url}`);
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error('API Error:', data);
                throw new Error(data.error || 'API request failed');
            }

            console.log('API Response:', data);
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    // Health check
    async health() {
        return this.get('/health');
    }

    // ⚠️ VULNERABILITY: Expose config endpoint
    async getConfig() {
        return this.get('/config');
    }

    // ⚠️ VULNERABILITY: Execute arbitrary SQL
    async executeSql(query) {
        return this.post('/execute', { query });
    }

    // User APIs
    async getUsers(email, password) {
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (password) params.append('password', password);
        return this.get(`/users?${params.toString()}`);
    }

    async register(userData) {
        return this.post('/register', userData);
    }

    // Flight APIs
    async getFlights(from, to) {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        return this.get(`/flights?${params.toString()}`);
    }

    // Hotel APIs
    async getHotels(city) {
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        return this.get(`/hotels?${params.toString()}`);
    }

    // Booking APIs
    async getBookings(userId) {
        return this.get(`/bookings/${userId}`);
    }

    async createBooking(bookingData) {
        return this.post('/bookings', bookingData);
    }
}

// Export singleton instance
const apiClient = new APIClient();

// Make available globally
if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
    window.APIClient = APIClient;
}

console.log('=== Blue Mountain Travel API Client ===');
console.log('Base URL:', API_BASE_URL);
console.log('Available methods:');
console.log('  - apiClient.health()');
console.log('  - apiClient.getConfig() ⚠️');
console.log('  - apiClient.executeSql(query) ⚠️');
console.log('  - apiClient.getUsers(email, password)');
console.log('  - apiClient.register(userData)');
console.log('  - apiClient.getFlights(from, to)');
console.log('  - apiClient.getHotels(city)');
console.log('  - apiClient.getBookings(userId)');
console.log('  - apiClient.createBooking(bookingData)');
console.log('========================================');
