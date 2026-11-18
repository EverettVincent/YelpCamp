# YelpCamp

YelpCamp is a full-stack campground review application built with Node.js, Express, MongoDB, and EJS. Users can register, sign in, browse campgrounds, create and manage campground listings, and submit reviews.

## Features

- User registration, login, and logout
- Session-based authentication with Passport.js
- Campground listing, creation, editing, and deletion
- Review creation and deletion
- Server-rendered EJS templates
- Flash success and error notifications
- Joi request validation
- MongoDB persistence through Mongoose
- Sample campground data seeding
- HTTP response compression

## Technology Stack

- Node.js and ESM modules
- Express 5
- MongoDB and Mongoose
- EJS and EJS-Mate
- Passport.js
- express-session
- Joi
- Bootstrap 5
- dotenv
- nodemon

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database, such as MongoDB Atlas
- `nodemon` available locally or globally

## Installation

1. Clone the repository:

```bash
git clone https://github.com/EverettVincent/YelpCamp.git
cd YelpCamp
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
MONGO_ATLAS_DB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
```

4. Start the application:

```bash
npm start
```

5. Open:

```text
http://localhost:3000
```

## NPM Scripts

| Script | Command | Description |
|---|---|---|
| `npm start` | `nodemon app.js` | Starts the development server on port 3000 |
| `npm run seedit` | `node seeds/index.js` | Deletes existing campgrounds and inserts sample records |
| `npm test` | Placeholder command | No test suite is currently configured |

## Environment Variables

| Variable | Required | Description |
|---|---:|---|
| `MONGO_ATLAS_DB_URL` | Yes | MongoDB Atlas connection string used by the application and seed script |
| `LOCAL_DB_URL` | No | Optional local MongoDB connection string reserved by commented code |
| `MONGO_ATLAS_DB_URL_AUTH_DEMO` | No | Optional alternate database connection used outside the active application |

## Usage

### Browse Campgrounds

Visit:

```text
http://localhost:3000/campgrounds
```

### Register

Visit:

```text
http://localhost:3000/register
```

The registration form sends:

- `formUsername`
- `formEmail`
- `formPassword`

### Create a Campground

A signed-in user can visit:

```text
http://localhost:3000/campgrounds/new
```

The creation form submits:

- `formTitle`
- `formLocation`
- `formImage`
- `formPrice`
- `formDescription`

Example:

```text
Title:       Pine Ridge Campground
Location:    Asheville, North Carolina
Image:       https://example.com/campground.jpg
Price:       35
Description: Quiet wooded campground with hiking trails.
```

### Edit or Delete a Campground

Open a campground and use its **Edit** or **Delete** controls.

### Add a Review

Open a campground detail page and submit:

- `formRating`, from 1 to 5
- `formBody`

## Routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/` | Home page |
| `GET` | `/campgrounds` | List campgrounds |
| `GET` | `/campgrounds/new` | New campground form |
| `POST` | `/campgrounds` | Create campground |
| `GET` | `/campgrounds/:id` | Display campground |
| `GET` | `/campgrounds/:id/edit` | Edit campground form |
| `PATCH` | `/campgrounds/:id` | Update campground |
| `DELETE` | `/campgrounds/:id` | Delete campground |
| `POST` | `/campgrounds/:id/reviews` | Create review |
| `DELETE` | `/campgrounds/:id/reviews/:reviewId` | Delete review |
| `GET` | `/register` | Registration form |
| `POST` | `/register` | Register user |
| `GET` | `/login` | Login form |
| `POST` | `/login` | Authenticate user |
| `GET` | `/logout` | Log out user |

## Database Seeding

The seed script inserts four generated campgrounds using data from `seeds/cities.js`:

```bash
npm run seedit
```

> Warning: the seed script deletes all existing campgrounds before inserting sample records.

## Dependencies

### Runtime Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server and routing |
| `mongoose` | MongoDB models and queries |
| `ejs` | Server-side template rendering |
| `ejs-mate` | EJS layouts and partials |
| `dotenv` | Environment variable loading |
| `express-session` | Session storage |
| `connect-flash` | Temporary flash notifications |
| `passport` | Authentication framework |
| `passport-local` | Username/password authentication |
| `passport-local-mongoose` | User password hashing and Passport integration |
| `joi` | Campground and review validation |
| `method-override` | Supporting PATCH and DELETE form requests |
| `compression` | HTTP response compression |

### Development Workflow

- `nodemon` is used by the start script, but it is not currently declared in `package.json`.
- Bootstrap is loaded from a CDN in the EJS layout.

## Folder Structure

```text
YelpCamp/
├── app.js                 # Express application setup and database connection
├── middleware.js          # Authentication and session middleware
├── schemas.js             # Joi validation schemas
├── package.json           # Dependencies and npm scripts
├── models/
│   ├── campground.js      # Campground model
│   ├── review.js          # Review model
│   └── user.js            # User model and Passport plugin
├── routes/
│   ├── campgrounds.js     # Campground routes
│   ├── reviews.js         # Review routes
│   └── users.js           # Authentication routes
├── views/
│   ├── layouts/           # EJS layout templates
│   ├── partials/          # Shared navbar, footer, and flash partials
│   ├── campgrounds/       # Campground templates
│   └── users/             # Registration and login templates
├── public/
│   ├── javascripts/       # Client-side form validation
│   └── stylesheets/       # Application styles
├── seeds/
│   ├── index.js           # Database seeding script
│   ├── cities.js          # Seed location data
│   └── seedHelpers.js     # Generated seed names
├── utils/
│   ├── ExpressError.js    # Custom HTTP error
│   └── catchAsync.js      # Async route error wrapper
└── old/
    └── index.ejs          # Legacy template
```

## Future Improvements

- Add campground, review, and user ownership/authorization
- Move the session secret and database settings to environment variables
- Add role-based permissions and route-level authorization
- Upload campground images to a cloud storage provider
- Integrate map and geocoding services
- Add pagination and campground search
- Add automated unit and integration tests
- Replace the placeholder test script with a real test runner
- Add a health check endpoint and structured logging
- Improve accessibility and responsive design
- Add API documentation for JSON endpoints
- Replace hardcoded sample and placeholder content
- Add request rate limiting and stronger session security
- Add a license and contribution guidelines

## License

No license is currently specified in `package.json`. Add one before redistributing or publishing the project.
