# Chat Workflow Application

This application handles a loan application process through a chat interface. It uses a "State Machine" to manage where the user is in the process.

## Workflow States (Where the user is)

Here is a list of all the possible stages a user can be in:

- **unauthenticated**: The user has just started and hasn't logged in yet.
- **enteringPhone**: The user is asked to enter their mobile number.
- **sendingOtp**: The system is currently sending a One-Time Password (OTP) to the mobile number.
- **waitingForOtp**: The OTP has been sent, and the system is waiting for the user to enter it.
- **validatingOtp**: The user entered the OTP, and the system is checking if it is correct.
- **otpFailed**: The OTP entered was incorrect. The user can try again or ask to resend the OTP.
- **authenticated**: The user has successfully logged in.
- **vehiclebrandselection**: The user is selecting the brand of their vehicle (e.g., Toyota, Honda).
- **vehiclemodelselection**: The user is selecting the specific model of the vehicle based on the brand.
- **vehiclevariantselection**: The user is selecting the variant (trim) of the vehicle model.
- **uploadpan**: The user is asked to upload their PAN card document.
- **uploadesign**: The user is asked to upload their E-sign document.
- **applicationsuccess**: The detailed application process is complete, and the loan application is submitted.

## Workflow Events (What happens)

These are the actions or events that move the user from one state to another:

- **LOGOUT**: The user logs out, and the system goes back to the start (`unauthenticated`).
- **HYDRATE_STATE**: restoring the user's previous session from memory.
- **ENTER_PHONE**: The user submits their phone number.
- **SEND_OTP**: The system successfully sends the OTP message.
- **VALIDATE_OTP**: The user submits the OTP code they received.
- **OTP_SUCCESS**: The system confirms the OTP is correct.
- **OTP_FAIL**: The system determines the OTP is incorrect.
- **RESEND_OTP**: The user requests to send the OTP again.
- **LOGIN_SUCCESS**: The login process is finished, and the user can start the application.
- **SELECT_OPTION**: The user picks an option from a list (used for Vehicle Brand, Model, and Variant).
- **PAN_UPLOADED**: The user successfully uploads their PAN card.
- **ESIGN_UPLOADED**: The user successfully uploads their E-sign document.

## How it works (The Path)

1.  **Start**: User arrives -> enters phone number -> gets OTP -> verifies OTP.
2.  **Selection**: User selects Vehicle Brand -> Vehicle Model -> Vehicle Variant.
3.  **Documents**: User uploads PAN Card -> uploads E-sign.
4.  **Finish**: Application submitted successfully!
