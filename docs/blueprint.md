# **App Name**: AttendEase

## Core Features:

- Admin Authentication: Secure admin login with email, password, and Admin ID, protected by bcrypt hashing.
- Student Authentication: Secure student login with email and Student ID.
- Real-time Attendance Trigger: Admin can trigger attendance, sending real-time notifications to logged-in students via WebSockets or Web Push Notifications.
- Automatic Attendance Marking: System automatically marks students present if online and notified, absent if offline or no response, with time-stamped records.
- Role-Based Access Control: Middleware-based role validation to protect admin and student routes server-side, ensuring strict separation of access.
- Attendance History: Admin can view historical and real-time attendance data; students can only view their own attendance status.
- Data Protection: Secure APIs to prevent direct database access from the frontend, with SQL injection and XSS prevention.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) for a professional and reliable feel.
- Background color: Light indigo (#E8EAF6), desaturated to provide a calm backdrop.
- Accent color: Blue-violet (#7986CB), adding a touch of contrast for important actions and elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern look; suitable for both headlines and body text.
- Simple, clear icons to represent attendance status, notifications, and admin functions.
- Clean, intuitive layout with clear visual hierarchy to differentiate between admin and student dashboards.
- Subtle transitions and animations to provide feedback on actions like attendance trigger and status updates.