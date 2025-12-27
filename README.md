# Chat Workflow Application

This project implements a conversational loan application interface using Next.js. I integrates **Novu** for push notifications. It features a state-driven chat workflow, robust form inputs (like vehicle selection), and file upload capabilities with image editing.

---

## 1. Novu Implementation & Frontend Architecture (Deep Dive)

This section details the Push Notification system using Novu and Firebase Cloud Messaging (FCM).

### The Push Notification Architecture
To successfully deliver a notification to a user's device, the architecture relies on three critical components working in tandem:
1.  **Permission**: The user authorization to receive alerts.
2.  **Addressing (FCM Token)**: A unique identifier for the specific browser/device session.
3.  **Background Listener (Service Worker)**: A dormant script that handles message delivery when the application tab is closed or inactive.

### Component Implementation Breakdown

#### 1. Configuration Layer: `lib/firebase.ts`
**Purpose**: Establishes the connection to the Firebase Interface.
This module uses the `firebase/messaging` library to initialize the application instance. It exports a singleton `messaging` function acting as the primary gateway for token retrieval.
```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Initialize the app with keys (API Key, Project ID)
const app = initializeApp(FIREBASE_CONFIG);
// Export the messaging instance so other files can use it to get tokens
export const messaging = async () => ...
```

#### 2. Client-Side Integration: `components/novu/novu-integration.tsx`
**Purpose**: Manages the lifecycle of user registration and token exchange.
This React component mounts on application load to execute the registration flow:

**Key Imports & Dependencies**:
- `getToken` (from `firebase/messaging`): Communicates with Firebase servers to generate the client-specific token.
- `NovuProvider` (from `@novu/notification-center`): Provides the context for the Novu inbox UI.

**Execution Flow**:
1.  **`Notification.requestPermission()`**: Invokes the browser's native permission dialog.
2.  **`getToken(...)`**: Upon approval, retrieves the alphanumeric FCM Token (e.g., `f7a3...`).
3.  **`registerFcmToken(...)`**: Transmits this token to the backend, effectively linking "User X" to "Device Y" within the Novu system.

#### 3. Background Handler: `public/firebase-messaging-sw.js`
**Purpose**: Ensures delivery reliability for offline or background states.
This is a **Service Worker**, a script that runs specifically in the browser's background thread, independent of the main application interface.

**Operational Logic**:
- **`importScripts`**: Dynamically loads Firebase SDKs from a CDN, as Service Workers operate outside the standard webpack bundle environment.
- **`Automatic Display`**: The imported Firebase SDK automatically handles displaying notifications when the app is in the background. No manual `onBackgroundMessage` handler is required.
- **`notificationclick`**: Catches user interactions with the system toast (e.g., clicking the notification), allowing the worker to refocus the tab or navigate to a specific URL.

### The Lifecycle of a Push Notification
The complete data flow for a delivered notification is as follows:

1.  **Initialization**: User visits the site -> `NovuIntegration.tsx` executes -> Permissions granted -> Token generated.
2.  **Registration**: The Token is stored in the Novu subscriber profile.
3.  **Trigger Event**: A system event occurs (e.g., "Loan Approved").
4.  **Dispatch**: Novu processes the event and routes the payload to Firebase (FCM), targeting the stored Token.
5.  **Transmission**: Firebase pushes the data to the user's browser.
6.  **Reception**:
    - **Foreground**: Application handles the event directly.
    - **Background**: `firebase-messaging-sw.js` wakes up, intercepts the payload, and generates the system notification.
7.  **Display**: The user views the notification on their device.

---

## 2. Chat Workflow Implementation

The application logic is built around a **State Machine** pattern managed via **Redux Toolkit**.

### Core Architecture
- **State Management**: The app uses a Redux slice (`workflow-slice`) to track the current user state (e.g., `enteringPhone`, `vehiclebrandselection`).
- **Persistence**: Application state and chat history are saved to `localStorage`. On reload, the `hydrateState` action restores the user's session exactly where they left off.
- **Main Entry**: `app/chat/page.tsx` serves as the orchestrator. It listens to state changes and dispatches necessary actions (like sending OTPs or triggering notifications).

### Key Features & Flows

#### A. Login Flow
The user must authenticate before proceeding with the application.
1.  **States**: `unauthenticated` -> `enteringPhone` -> `sendingOtp` -> `validatingOtp` -> `authenticated`.
2.  **Logic**:
    -   User enters a phone number.
    -   An OTP is simulated/sent via `sendOtpThunk`.
    -   Upon successful validation (`loginSuccess`), the user transitions to the main application flow.

#### B. Vehicle Selection
A specialized component allowing users to drill down into specific vehicle details.
-   **Component**: `components/inputs/vehicle-selection.tsx`
-   **Behavior**:
    -   **Dynamic Input**: The user selects **Brand**, then **Model**, then **Variant**.
    -   **Freezing Logic**: Once the user moves past a selection stage (e.g., selecting a Variant), the previous inputs (Brand/Model) become "frozen" (read-only) to prevent inconsistent state changes.
    -   **Interaction**: Updates the global `vehicleData` state in Redux.

#### C. File Upload & Image Editor
A robust modal for uploading documents (PAN Card, E-Sign).
-   **Component**: `components/inputs/upload-modal.tsx`
-   **Features**:
    -   **Dual Source**: Users can choose **Scan** (opens Camera on mobile) or **Upload** (System File Picker).
    -   **Image Processing**:
        -   Uses `react-easy-crop` for cropping images.
        -   Includes a **"Skip"** button to bypass editing if the image is already perfect.
        -   Generates client-side previews using `URL.createObjectURL`.
    -   **Upload List**: Displays thumbnails, file names, and success status indicators.
