# RideSync Frontend

RideSync is a cab-sharing platform for commuters and travelers across India. It lets users create ride groups, find people heading the same way, split cab fares, and coordinate updates through the RideSync REST API.

## Features

- **Smart Ride Matching**: Search for rides by origin, destination, date and seats needed. Each result gets a match score (0–100) based on text similarity, geographic proximity, departure time closeness and seat availability — so the best rides always appear first.
- **Offer a Ride**: Drivers can list rides with origin, destination, departure time, available seats and price per seat. The ride is instantly searchable by other users.
- **Book a Seat**: Passengers can book one or more seats on any active ride. The system prevents double-booking, blocks drivers from booking their own rides, and atomically decrements available seats to avoid race conditions.
- **My Rides**: Drivers can view all rides they have offered, see booking counts, and cancel active rides.
- **My Bookings**: Passengers can view all their bookings with ride details and driver contact info, and cancel confirmed bookings.
- **Authentication**: Full JWT-based auth with access tokens (15 min) and refresh tokens (7 days). Tokens are silently refreshed in the background — users stay logged in without interruption.
- **Real-time Notifications**: Booking confirmations and cancellations trigger background jobs that save in-app notifications and send emails via the backend worker.

## How It Works

1. User registers or logs in — a JWT access token is stored in localStorage and a refresh token is set as an httpOnly cookie.
2. Every API request automatically attaches the access token via an Axios interceptor.
3. If a request returns 401 (token expired), the interceptor silently calls `/auth/refresh`, stores the new token, and retries the original request — all without the user noticing.
4. On the search page, the frontend hits the `/api/match` endpoint which returns rides ranked by a scoring engine combining text match, geo distance (Haversine formula) and time proximity.
5. Booking a ride triggers a BullMQ job on the backend that sends a confirmation email and saves an in-app notification asynchronously.
6. Cancelling a ride or booking atomically restores available seats via a database transaction.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with request/response interceptors
- **Auth State**: React Context API with localStorage persistence
- **Notifications**: react-hot-toast
- **Icons**: lucide-react
- **Deployment**: Azure App Service + GitHub Actions CI/CD
