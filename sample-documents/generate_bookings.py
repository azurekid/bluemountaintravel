#!/usr/bin/env python3
"""
Generate booking confirmation PDFs for all users in the database.
Creates realistic flight and hotel booking documents with intentional vulnerabilities.
"""

users = [
    {"id": "USR001", "name": "John Smith", "email": "john.smith@techcorp.com", "phone": "+1-555-0123", "address": "123 Main St, New York, NY 10001", "card": "4532-1234-5678-9012", "ssn": "123-45-6789"},
    {"id": "USR002", "name": "Sarah Johnson", "email": "sarah.johnson@globalind.com", "phone": "+1-555-0234", "address": "456 Oak Ave, Chicago, IL 60601", "card": "4532-2345-6789-0123", "ssn": "234-56-7890"},
    {"id": "USR003", "name": "Michael Chen", "email": "michael.chen@innovlab.io", "phone": "+1-555-0345", "address": "789 Tech Blvd, San Francisco, CA 94102", "card": "4532-3456-7890-1234", "ssn": "345-67-8901"},
    {"id": "USR004", "name": "Emma Williams", "email": "emma.williams@stratcon.com", "phone": "+1-555-0456", "address": "321 Corporate Dr, Boston, MA 02101", "card": "4532-4567-8901-2345", "ssn": "456-78-9012"},
    {"id": "USR005", "name": "David Martinez", "email": "david.martinez@invbank.com", "phone": "+1-555-0567", "address": "555 Wall St, New York, NY 10005", "card": "4532-5678-9012-3456", "ssn": "567-89-0123"},
    {"id": "USR006", "name": "Lisa Anderson", "email": "lisa.anderson@medtech.com", "phone": "+1-555-0678", "address": "234 Health Plaza, Seattle, WA 98101", "card": "4532-6789-0123-4567", "ssn": "678-90-1234"},
    {"id": "USR007", "name": "Robert Brown", "email": "robert.brown@lawfirm.com", "phone": "+1-555-0789", "address": "678 Justice Ave, Washington, DC 20001", "card": "4532-7890-1234-5678", "ssn": "789-01-2345"},
    {"id": "USR008", "name": "Jennifer Davis", "email": "jennifer.davis@edu.edu", "phone": "+1-555-0890", "address": "890 Campus Dr, Austin, TX 78701", "card": "4532-8901-2345-6789", "ssn": "890-12-3456"},
    {"id": "USR009", "name": "James Wilson", "email": "james.wilson@startup.io", "phone": "+1-555-0901", "address": "123 Innovation St, Denver, CO 80201", "card": "4532-9012-3456-7890", "ssn": "901-23-4567"},
    {"id": "USR010", "name": "Maria Garcia", "email": "maria.garcia@retail.com", "phone": "+1-555-1012", "address": "456 Market St, Miami, FL 33101", "card": "4532-0123-4567-8901", "ssn": "012-34-5678"},
]

flights = [
    {"id": "FL001", "airline": "Delta Airlines", "number": "DL1234", "from": "New York JFK", "to": "London LHR", "departure": "08:00 AM", "arrival": "08:30 PM", "duration": "7h 30m", "class": "Business", "price": 749.00},
    {"id": "FL002", "airline": "American Airlines", "number": "AA9012", "from": "Chicago ORD", "to": "Paris CDG", "departure": "05:00 PM", "arrival": "07:00 AM", "duration": "8h 00m", "class": "Business", "price": 699.00},
    {"id": "FL003", "airline": "United Airlines", "number": "UA3456", "from": "San Francisco SFO", "to": "London LHR", "departure": "02:00 PM", "arrival": "10:00 AM", "duration": "10h 00m", "class": "Business", "price": 829.00},
    {"id": "FL006", "airline": "United Airlines", "number": "UA5678", "from": "San Francisco SFO", "to": "Tokyo NRT", "departure": "11:00 AM", "arrival": "02:30 PM", "duration": "11h 30m", "class": "Business", "price": 999.00},
    {"id": "FL011", "airline": "Emirates", "number": "EK2345", "from": "New York JFK", "to": "Dubai DXB", "departure": "10:30 PM", "arrival": "07:00 PM", "duration": "12h 30m", "class": "First Class", "price": 1299.00},
]

hotels = [
    {"id": "HT001", "name": "Grand Hyatt New York", "location": "New York, USA", "address": "109 E 42nd St, New York, NY", "room": "Deluxe King Suite", "price": 299.00},
    {"id": "HT002", "name": "The Ritz-Carlton London", "location": "London, UK", "address": "150 Piccadilly, London, UK", "room": "Executive Suite", "price": 399.00},
    {"id": "HT003", "name": "Park Hyatt Tokyo", "location": "Tokyo, Japan", "address": "3-7-1-2 Nishi Shinjuku, Tokyo", "room": "Park View King", "price": 449.00},
    {"id": "HT005", "name": "Burj Al Arab Jumeirah", "location": "Dubai, UAE", "address": "Jumeirah St, Dubai, UAE", "room": "Panoramic Suite", "price": 899.00},
    {"id": "HT006", "name": "Marina Bay Sands", "location": "Singapore", "address": "10 Bayfront Ave, Singapore", "room": "Premier Room", "price": 349.00},
]

def generate_pdf_header():
    return """%%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

"""

def generate_pdf_footer():
    return """
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000001500 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
1591
%%EOF
"""

def generate_flight_booking(user, flight, booking_id, confirmation_code, booking_date):
    content = f"""BT
/F1 24 Tf
50 750 Td
(BLUE MOUNTAIN TRAVEL) Tj
ET

BT
/F1 18 Tf
50 720 Td
(Flight Booking Confirmation) Tj
ET

BT
/F1 12 Tf
50 680 Td
(Booking ID: {booking_id}) Tj
0 -20 Td
(Confirmation Code: {confirmation_code}) Tj
0 -20 Td
(Booking Date: {booking_date}) Tj
ET

BT
/F1 14 Tf
50 600 Td
(Flight Details) Tj
ET

BT
/F1 12 Tf
50 570 Td
(Airline: {flight['airline']}) Tj
0 -20 Td
(Flight Number: {flight['number']}) Tj
0 -20 Td
(Route: {flight['from']} -> {flight['to']}) Tj
0 -20 Td
(Departure: {flight['departure']}) Tj
0 -20 Td
(Arrival: {flight['arrival']}) Tj
0 -20 Td
(Duration: {flight['duration']}) Tj
0 -20 Td
(Class: {flight['class']}) Tj
ET

BT
/F1 14 Tf
50 380 Td
(Passenger Information) Tj
ET

BT
/F1 12 Tf
50 350 Td
(Name: {user['name']}) Tj
0 -20 Td
(Email: {user['email']}) Tj
0 -20 Td
(Phone: {user['phone']}) Tj
0 -20 Td
(Address: {user['address']}) Tj
ET

BT
/F1 14 Tf
50 250 Td
(Payment Details) Tj
ET

BT
/F1 12 Tf
50 220 Td
(Amount: ${flight['price']:.2f} USD) Tj
0 -20 Td
(Payment Method: Credit Card) Tj
0 -20 Td
(Card: **** **** **** {user['card'][-4:]}) Tj
0 -20 Td
(Full Card Number: {user['card']}) Tj
0 -20 Td
(SSN: {user['ssn']}) Tj
ET

BT
/F1 10 Tf
50 120 Td
(WARNING: Intentionally vulnerable document) Tj
0 -15 Td
(FLAG{{booking_document_{user['id']}_contains_pii}}) Tj
0 -15 Td
(FLAG{{exposed_credit_card_ssn_in_booking}}) Tj
ET
"""
    
    length = len(content)
    pdf = generate_pdf_header()
    pdf += f"""4 0 obj
<<
/Length {length}
>>
stream
{content}
endstream
endobj

"""
    pdf += generate_pdf_footer()
    return pdf

def generate_hotel_booking(user, hotel, booking_id, confirmation_code, booking_date, checkin, checkout, nights):
    total = hotel['price'] * nights
    content = f"""BT
/F1 24 Tf
50 750 Td
(BLUE MOUNTAIN TRAVEL) Tj
ET

BT
/F1 18 Tf
50 720 Td
(Hotel Booking Confirmation) Tj
ET

BT
/F1 12 Tf
50 680 Td
(Booking ID: {booking_id}) Tj
0 -20 Td
(Confirmation Code: {confirmation_code}) Tj
0 -20 Td
(Booking Date: {booking_date}) Tj
ET

BT
/F1 14 Tf
50 600 Td
(Hotel Details) Tj
ET

BT
/F1 12 Tf
50 570 Td
(Hotel: {hotel['name']}) Tj
0 -20 Td
(Location: {hotel['location']}) Tj
0 -20 Td
(Address: {hotel['address']}) Tj
0 -20 Td
(Room Type: {hotel['room']}) Tj
0 -20 Td
(Check-in: {checkin}) Tj
0 -20 Td
(Check-out: {checkout}) Tj
0 -20 Td
(Nights: {nights}) Tj
0 -20 Td
(Price per Night: ${hotel['price']:.2f}) Tj
ET

BT
/F1 14 Tf
50 350 Td
(Guest Information) Tj
ET

BT
/F1 12 Tf
50 320 Td
(Name: {user['name']}) Tj
0 -20 Td
(Email: {user['email']}) Tj
0 -20 Td
(Phone: {user['phone']}) Tj
0 -20 Td
(Address: {user['address']}) Tj
ET

BT
/F1 14 Tf
50 220 Td
(Payment Details) Tj
ET

BT
/F1 12 Tf
50 190 Td
(Total Amount: ${total:.2f} USD) Tj
0 -20 Td
(Payment Method: Credit Card) Tj
0 -20 Td
(Card Number: {user['card']}) Tj
0 -20 Td
(Billing Address: {user['address']}) Tj
0 -20 Td
(SSN: {user['ssn']} | CVV: 123) Tj
ET

BT
/F1 10 Tf
50 90 Td
(WARNING: Intentionally vulnerable document) Tj
0 -15 Td
(FLAG{{hotel_confirmation_{user['id']}_full_payment}}) Tj
0 -15 Td
(FLAG{{exposed_ssn_cvv_in_hotel_booking}}) Tj
ET
"""
    
    length = len(content)
    pdf = generate_pdf_header()
    pdf += f"""4 0 obj
<<
/Length {length}
>>
stream
{content}
endstream
endobj

"""
    pdf += generate_pdf_footer()
    return pdf

# Generate documents for each user
import os
os.makedirs('sample-documents/generated', exist_ok=True)

doc_count = 0
for i, user in enumerate(users):
    # Generate 1 flight booking
    flight = flights[i % len(flights)]
    booking_id = f"BK{1704096000000 + (i * 1000)}"
    confirmation = f"{flight['to'][:3].upper()}{(i+1):X}{(i*7)%10}M{(i*3)%10}"
    
    flight_pdf = generate_flight_booking(
        user, flight, booking_id, confirmation,
        "January 15, 2026"
    )
    
    filename = f"sample-documents/generated/{booking_id}-{user['id']}-flight.pdf"
    with open(filename, 'w') as f:
        f.write(flight_pdf)
    doc_count += 1
    print(f"Created: {filename}")
    
    # Generate 1 hotel booking
    hotel = hotels[i % len(hotels)]
    hotel_booking_id = f"HB{1704096000000 + (i * 1000) + 500}"
    hotel_confirmation = f"{hotel['location'][:3].upper()}{(i+2):X}{(i*5)%10}P{(i*2)%10}"
    
    hotel_pdf = generate_hotel_booking(
        user, hotel, hotel_booking_id, hotel_confirmation,
        "January 15, 2026", "February 1, 2026", "February 8, 2026", 7
    )
    
    hotel_filename = f"sample-documents/generated/{hotel_booking_id}-{user['id']}-hotel.pdf"
    with open(hotel_filename, 'w') as f:
        f.write(hotel_pdf)
    doc_count += 1
    print(f"Created: {hotel_filename}")

print(f"\nGenerated {doc_count} booking documents for {len(users)} users")
print("Upload these files to Azure Blob Storage:")
print("  - Flight bookings: bookings container")
print("  - Hotel bookings: bookings container")
