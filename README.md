# ECMO Bridge

ECMO Bridge is a state-of-the-art application designed to efficiently allocate ECMO (Extracorporeal Membrane Oxygenation) machines to patients in critical need. By integrating a sophisticated dynamic matching algorithm, ECMO Bridge assesses multiple vital factors to ensure optimal resource distribution and enhanced patient care.

## Home Page Design

![image](https://github.com/user-attachments/assets/136d6a06-3c10-4211-afb3-7216e7acd7e8)


## Key Features

- **Dynamic Matching Algorithm:** Strategically matches patients with ECMO machines considering medical urgency, geographical location, compatibility, and current availability.
- **Real-Time Updates:** Maintains and displays the status of ECMO machine availability in real-time, facilitating quick adjustments across various locations.
- **User-Friendly Interface:** Offers a clean and intuitive interface for medical professionals and administrative personnel to interact with the system effortlessly.

## Tech Stack

- **Frontend Framework:** Next.js
- **Backend Tools:**
  - **Authentication:** Managed with Clerk
  - **ORM:** Implemented using Drizzle
  - **Type Safety:** Ensured through tRPC
- **Database:** Hosted on Supabase
- **APIs:** Integrated with Google Maps for location services
- **Styling and UI Components:** Utilizes ShadCN UI and Tailwind CSS for a modern and responsive design


## Checklist for Development Progress

- [x] Design and implement the landing page
- [x] Design the sub-navbar
- [x] Add authentication
- [x] Transition UI components to the new framework
- [x] Integrate tRPC for type-safe remote procedure calls
- [x] Add footer
- [x] Design backend (matching) logic

Unlock Patients & ECMOs
- [ ] Should have a list of patients on the left hand side, in any order
- [ ] Google Map of Arizona with ECMO device
- [ ] Realtime matching update between ECMO hospitals and patients (Create an algorithm to match patients to ECMO hospitals)

- [ ]  Add Clerk blocklist (Protection from bots. Only allow mayo.edu and asu.edu emails)
       
Design Dashboard should include:
- [ ] Button to Patient & ECMOs,
- [ ] Button to MatchList,
- [ ] Button to Settings,
- [ ] Button to Home
      
- [ ] Complete the Match List page

Add Settings:
- [ ] Add patient
- [ ] Delete patient
- [ ] Update/Change doctor

## Important Note

This project is proudly part of the EPICS initiative at Arizona State University (ASU). It is being actively developed by the Automated Medical Resource Allocation Team, aiming to revolutionize how medical resources are managed and allocated in critical care scenarios.Test
