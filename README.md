# User Registration Form

A beginner-friendly full-stack registration app with React, Spring Boot, and PostgreSQL. The React app sends JSON to Spring Boot; Spring validates each request and stores valid registrations in PostgreSQL through Spring Data JPA.

## 1. Architecture and request flow

```text
Browser (React / Vite :5173)
    -- Axios POST or GET JSON -->
Spring Boot REST API (:8080)
    -- Spring Data JPA / Hibernate -->
PostgreSQL (registration_db)
```

The browser never connects directly to the database. Database credentials stay in the backend environment, and CORS allows the configured React origin to call the API.

## 2. Prerequisites and official downloads

- **Node.js LTS** (includes npm): https://nodejs.org/
- **Java 17 or newer**: https://adoptium.net/temurin/releases/
- **Maven 3.9+**: https://maven.apache.org/download.cgi
- **PostgreSQL**: https://www.postgresql.org/download/
- **pgAdmin 4** (database UI): https://www.pgadmin.org/download/
- **Visual Studio Code**: https://code.visualstudio.com/
- **IntelliJ IDEA**: https://www.jetbrains.com/idea/download/ (or Eclipse: https://www.eclipse.org/downloads/)
- **Postman** (optional API client): https://www.postman.com/downloads/

After installing, open PowerShell and check `node --version`, `npm --version`, `java -version`, and `mvn --version`. Ensure Maven's `bin` folder is on your `PATH`.

## 3. Create and run the React application

The frontend is already scaffolded in `frontend/`. From the project root:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the URL Vite prints (normally http://localhost:5173). Set `VITE_API_BASE_URL` in `frontend/.env` if the backend is hosted somewhere other than `http://localhost:8080/api`.

## 4. Frontend folder structure

```text
frontend/
  .env.example
  index.html
  package.json
  vite.config.js
  src/
    App.jsx
    main.jsx
    components/
      RegistrationForm.jsx
    services/
      userService.js
    styles/
      global.css
```

## 5. Frontend files

- `frontend/src/main.jsx` mounts the React application and global stylesheet.
- `frontend/src/App.jsx` provides the page shell.
- `frontend/src/components/RegistrationForm.jsx` owns controlled inputs, client-side validation, loading state, and notices.
- `frontend/src/services/userService.js` contains the Axios API calls.
- `frontend/src/styles/global.css` contains the responsive layout and form styles.
- `frontend/package.json`, `frontend/vite.config.js`, and `frontend/index.html` configure Vite and React.
- `frontend/.env.example` documents the public API URL setting. Do not put database credentials or secrets in a `VITE_` variable; frontend variables are visible in the browser.

All frontend source files are included in this project.

## 6. Create a Spring Boot project with Spring Initializr

The backend is included in `backend/`. To create an equivalent starter yourself, visit https://start.spring.io/ and choose:

- Project: Maven
- Language: Java
- Spring Boot: a current stable 3.x release
- Java: 17 or newer
- Group: `com.example`
- Artifact: `registration`
- Packaging: Jar
- Dependencies: Spring Web, Spring Data JPA, Validation, PostgreSQL Driver

The included backend uses package `com.example.registration` and Java 17.

## 7. Maven dependencies

`backend/pom.xml` declares Spring Web (REST endpoints), Spring Data JPA (repository support), Validation (Jakarta Bean Validation), the PostgreSQL JDBC driver, and Spring Boot Test. Hibernate is provided by Spring Data JPA's Hibernate-backed starter; there is no need to add Hibernate separately.

## 8. Backend folder structure

```text
backend/
  pom.xml
  src/main/java/com/example/registration/
    RegistrationApplication.java
    config/CorsConfig.java
    controller/UserController.java
    dto/ApiError.java
    dto/RegistrationRequest.java
    dto/UserResponse.java
    entity/User.java
    exception/DuplicateEmailException.java
    exception/GlobalExceptionHandler.java
    repository/UserRepository.java
    service/UserService.java
  src/main/resources/application.properties
```

## 9. Backend files and API

The complete Java source is in the folders shown above. The responsibilities are:

- `RegistrationRequest` validates incoming data; `UserResponse` exposes only safe response fields.
- `User` maps to the `users` table. Email is unique and stored in lowercase.
- `UserRepository` provides persistence and case-insensitive duplicate checks.
- `UserService` applies registration rules and returns users ordered by id.
- `UserController` exposes the REST endpoints.
- `GlobalExceptionHandler` returns meaningful validation and duplicate-email errors.
- `CorsConfig` allows the configured frontend origin.

Endpoints:

| Method | URL | Purpose |
|---|---|---|
| POST | `http://localhost:8080/api/users` | Register a user |
| GET | `http://localhost:8080/api/users` | List registered users |

Example POST body:

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "mobileNumber": "+1 (555) 123-4567"
}
```

The mobile number is a string (not a numeric value), so `+` and leading zeroes are preserved. Names must not be blank, email must be valid, and phone numbers must contain 7–15 digits and use only common phone punctuation. Submitting an email already registered returns HTTP 409.

## 10. Install PostgreSQL, pgAdmin, and create the database

1. Download PostgreSQL from https://www.postgresql.org/download/ and run the installer for your operating system. On Windows, the installer can also install pgAdmin and Stack Builder.
2. During setup, note the port (normally `5432`) and the password you choose for the PostgreSQL `postgres` administrator account. Keep that password private.
3. If pgAdmin was not installed with PostgreSQL, download it from https://www.pgadmin.org/download/.
4. Open pgAdmin, connect to the local PostgreSQL server with the password you chose, then right-click **Databases → Create → Database**. Set the name to `registration_db` and save.
5. The app creates the `users` table automatically on first startup using Hibernate (`spring.jpa.hibernate.ddl-auto=update`). You do not need to create the table by hand.

To create the database in the SQL tool instead:

```sql
CREATE DATABASE registration_db;
```

## 11. Configure Spring Boot to connect to PostgreSQL

The connection settings are in `backend/src/main/resources/application.properties`. Set these environment variables in the same PowerShell window before starting the backend (replace the example password):

```powershell
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "your-local-postgres-password"
$env:DB_URL = "jdbc:postgresql://localhost:5432/registration_db"
$env:CORS_ALLOWED_ORIGIN = "http://localhost:5173"
```

Spring Boot reads the JDBC URL and credentials from these variables. Hibernate uses the PostgreSQL driver and JPA entity mapping to create/update the schema. For a real deployment, use a dedicated database account with limited permissions and a managed secrets mechanism; do not commit real passwords.

## 12. React and Spring Boot / Axios integration

`frontend/src/services/userService.js` reads `VITE_API_BASE_URL` and sends the form as JSON with Axios. The form posts to `/users`; the backend's CORS configuration permits `http://localhost:5173` by default. Change the backend `CORS_ALLOWED_ORIGIN` and frontend `VITE_API_BASE_URL` together if you change the development host or port.

## 13. Test the API with Postman

1. Start PostgreSQL and the Spring Boot backend.
2. In Postman, create a **POST** request to `http://localhost:8080/api/users`.
3. Select **Body → raw → JSON**, paste the example JSON from Step 9, then click **Send**. A successful request returns HTTP 201 and a user object.
4. Send the same email again to see the HTTP 409 duplicate response. Try a blank name or invalid phone to see HTTP 400 validation errors.
5. Create a **GET** request to `http://localhost:8080/api/users` and click **Send** to retrieve all users.

## 14. Run both applications

Start the backend in one PowerShell window from the project root:

```powershell
cd backend
mvn spring-boot:run
```

Run this command from `backend/` after configuring the database environment variables in that same PowerShell window.

To run the backend validation tests, use `mvn test` from `backend/`.

Start the frontend in a second PowerShell window:

```powershell
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173, complete all fields, and submit. The UI displays field-level errors, disables submission while saving, reports success/failure, and clears the form only after a successful registration.

## 15. Verify records in PostgreSQL

In pgAdmin, select `registration_db`, open **Tools → Query Tool**, and run:

```sql
SELECT id, first_name, last_name, email, mobile_number
FROM users
ORDER BY id;
```

The Java field names are mapped to snake_case database columns. You can also use Postman's GET endpoint to view the same records.
