# Wireframes Description: AI Pitch Writer

Here's a textual description of the key screens and their layouts. For actual wireframes, you would use tools like Figma, Balsamiq, or Sketch to draw these out.

## 1. Homepage (`/`)
*   **Layout:** Full-width header, main content area, full-width footer.
*   **Header:**
    *   Left: Logo ("AI Pitch Writer")
    *   Center (Desktop): Navigation links (e.g., Features, Pricing, Examples - *currently removed, but could be re-added*)
    *   Right: "Sign In" button, "Get Started" button.
*   **Hero Section:**
    *   Centered, large, bold headline (e.g., "Create Compelling Pitches in Minutes").
    *   Sub-headline explaining the value proposition.
    *   Call-to-action buttons: "Get Started Free" (primary), "View Examples" (secondary).
    *   Small disclaimer text below buttons.
*   **Features Section:**
    *   Centered section title and description.
    *   Grid of 4 feature cards (icon, title, description).
*   **CTA Section:**
    *   Full-width background color.
    *   Centered, bold headline.
    *   Sub-headline.
    *   Call-to-action button: "Start Writing Now".
*   **Footer:**
    *   Centered copyright text.

## 2. Authentication Page (`/auth`)
*   **Layout:** Centered card on a background gradient.
*   **Card Content:**
    *   Title: "Welcome back" or "Sign In".
    *   Description: "Enter your email to receive a magic link for sign in".
    *   Email input field.
    *   "Send magic link" button (with loading state).
    *   Link: "← Back to home".
*   **Email Sent State:**
    *   Centered card with success icon (Mail).
    *   Title: "Check your email".
    *   Description: "We've sent a magic link to [email]. Click the link to sign in."
    *   "Back to login" button.

## 3. Dashboard Page (`/dashboard`)
*   **Layout:** Full-width dashboard header, main content area with a two-column layout (large left, smaller right).
*   **Dashboard Header:**
    *   Left: App Title ("AI Pitch Writer") and "Welcome back, [User Email]".
    *   Right: User Avatar with Dropdown Menu (Sign out).
*   **Main Content Area (Grid):**
    *   **Left Column (2/3 width): Pitch Generator**
        *   Card with title "Generate New Pitch".
        *   Input field for "Your Idea".
        *   Select dropdown for "Pitch Type".
        *   Textarea for "Additional Details".
        *   "Generate Pitch" button (with loading state).
        *   Conditional display of "Generated Pitch" card below, with content and "Copy to Clipboard" button.
    *   **Right Column (1/3 width): Recent Pitches (History)**
        *   Card with title "Recent Pitches".
        *   List of pitch items:
            *   Each item: Title, Type badge, Date, truncated content preview.
            *   "View Full Pitch" button.
            *   Delete icon button (top right of each item).
        *   Placeholder message if no pitches exist.

## 4. Pitch Detail Page (`/dashboard/pitches/[id]`)
*   **Layout:** Full-width dashboard header, main content area with a centered single column.
*   **Dashboard Header:** Same as Dashboard Page.
*   **Main Content Area:**
    *   Top: "← Back to Dashboard" button (left), Delete Pitch button (right).
    *   **Pitch Card:**
        *   Header: Pitch Title, Type badge, Generated Date.
        *   Content: Large text area displaying the full pitch content (Markdown rendered).
        *   Bottom: "Copy Pitch" button.
