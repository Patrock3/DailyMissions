The Daily Missions App lets users send each other daily missions, earn experience points (EXP), and track progress through leaderboards and profile pages. Users can register, log in, and view their current mission, level, and stats. Missions are assigned between users, with EXP contributing to their overall level. A leaderboard ranks players by missions completed and level. The app is built with HTML, CSS, JavaScript, and Supabase for backend services, offering easy authentication and data management.

Timeline:
Issue: Supabase Client Initialization Error
We encountered an issue where the Supabase client was failing to initialize, resulting in a ReferenceError: Cannot access 'supabase' before initialization. This was likely due to script loading order issues or conflicts within the HTML page.

Resolution: Switching to Fetch API
To resolve the issue, we simplified our approach by using the Fetch API to directly communicate with the Supabase REST API. This method bypassed the need for the Supabase client library, allowing us to send requests with the necessary headers (apikey and Authorization) to interact with Supabase.

Why This Works:

Provides direct control over HTTP requests.
Ensures compatibility and simplicity.
Avoids potential issues with the Supabase client library.
This approach was successful and can be relied upon for future tasks and project development.
