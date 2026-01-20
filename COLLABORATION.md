# StudentShifts.ie - Collaboration Guide

## 1. Getting Access
Ask the project owner to invite your GitHub account as a **Collaborator** in the repository settings.

## 2. Setup
1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/tOMS1902/StudentShifts.ie.git
    cd "Student shifts"
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables (CRITICAL)**:
    Create two files in the root folder (same place as `package.json`):
    
    **File 1: `.env`** (Ask project owner for the secrets)
    ```env
    MONGODB_URI=mongodb+srv://... (Get from Owner)
    JWT_SECRET=... (Get from Owner)
    PORT=4000
    ```

    **File 2: `.env.local`** (For frontend)
    ```env
    VITE_API_URL=http://localhost:4000/api
    ```

## 3. Running the App
You need two terminals running at the same time:

**Terminal 1 (Backend):**
```bash
npm run server:dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Open `http://localhost:5173` to view the app.

## 4. How to Contribute
1.  **Pull latest changes** before starting:
    ```bash
    git pull
    ```
2.  Make your changes.
3.  **Push your work**:
    ```bash
    git add .
    git commit -m "Description of what I changed"
    git push
    ```
