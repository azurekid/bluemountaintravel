# Blue Mountain Travel Website

A modern, professional travel agency website featuring glassmorphism design and responsive layout.

## Configuration

The `config.json` file contains database and storage credentials:

```json
{
  "database": {
    "username": "dbadmin",
    "host": "bluemountaintravel-db.database.windows.net",
    "database": "travelbookings"
  },
  "storage": {
    "sasToken": "...",
    "accountName": "bluemountaintravel"
  }
}
```

### ⚠️ Security Note

**IMPORTANT**: In a production environment, this configuration should be handled as follows:

1. **Database Credentials**: Should NEVER be in client-side code
   - Move to server-side environment variables
   - Use Azure Key Vault or similar secret management service
   - Access only through server-side API endpoints

2. **SAS Token**: Should be generated server-side on-demand
   - Use short-lived tokens with minimal permissions
   - Generate tokens server-side when needed
   - Never expose long-lived tokens in client code

3. **Recommended Architecture**:
   ```
   Client (Browser) → API Gateway/Backend → Database/Storage
   ```
   The client should only communicate with a backend API that securely handles credentials.

## Features

- **Modern Glass Effect Design**: Semi-transparent cards with backdrop blur
- **Animated Gradient Background**: Smooth color transitions
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Elements**: Smooth animations and hover effects
- **Search Functionality**: Destination search with date pickers
- **Featured Destinations**: Showcase popular travel locations
- **Package Listings**: Display travel packages with pricing
- **Customer Testimonials**: Build trust with reviews
- **Newsletter Signup**: Collect email subscriptions

## Technologies Used

- HTML5
- CSS3 (with CSS Variables and Glassmorphism effects)
- Vanilla JavaScript
- Google Fonts (Inter & Playfair Display)

## Design Inspiration

The design draws inspiration from leading travel agencies like TUI and YourTravelBusiness.nl, featuring:
- Professional color schemes
- Clean, modern layouts
- Glass morphism UI elements
- Smooth animations and transitions

## Local Development

To run locally:

```bash
cd public
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Deployment

This is an Azure Static Web App. The deployment is handled automatically through GitHub Actions when changes are pushed to the main branch.
