# 🎓 Django + React Subscription-Based Learning Platform

A full-stack web application built with Django and React that delivers educational content with a subscription-based access model. Users can download learning materials and upgrade to premium plans via secure Stripe integration.

---

## 🚀 Features

### 👤 User Features

* User authentication (login/signup)
* Access to free and premium educational content
* Downloadable learning resources (files)
* Subscription plans (Pro / Premium)
* Secure Stripe checkout for subscriptions
* Manage subscription (upgrade, downgrade, cancel) via billing portal

### 💳 Payment Integration

* Stripe subscription-based billing
* Hosted checkout sessions
* Stripe Billing Portal integration
* Webhook handling for:

  * Subscription activation
  * Payment success/failure
  * Plan changes and cancellations
* Local webhook testing using Stripe CLI

### 🛠️ Admin Features

* Django Admin Control Panel (ACP)
* Upload and manage educational content
* Create and manage subscription tiers
* Manage users and their subscriptions
* Control access to premium resources

---

## 🧱 Tech Stack

**Frontend:**

* React
* Axios
* Bootstrap / CSS

**Backend:**

* Django
* Django REST Framework

**Payments:**

* Stripe (Subscriptions, Checkout, Webhooks, Billing Portal)

**Database:**

* SQLite / PostgreSQL

---

## ⚙️ How It Works

1. User signs up or logs in
2. User accesses free or restricted content
3. Premium content requires an active subscription
4. User selects a plan → redirected to Stripe Checkout
5. After payment, Stripe sends webhook to backend
6. Backend updates user's subscription status
7. User can manage subscription via Stripe Billing Portal

---

## 🎥 Demo

Watch the full walkthrough of the application here:

👉 https://www.youtube.com/watch?v=link

The demo covers:

* User authentication
* Accessing free vs premium content
* Subscription flow using Stripe Checkout
* Managing subscriptions via Billing Portal
* Admin panel for content and user management

---

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```
SECRET_KEY=your_django_secret
DEBUG=True

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

⚠️ Never expose real API keys in the repository.

---

## 🧪 Stripe Testing

Use Stripe test card:

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

To test webhooks locally:

```
stripe listen --forward-to localhost:8000/api/webhooks/stripe/
```

---

## 📦 Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/maaz-links/AcademyVault.git
cd AcademyVault
```

---

### 2. Backend Setup (Django)

## 🖥️ System Requirements

Make sure you have the following installed:

* **Python** (>= 3.10)
* **Poetry** (for dependency management)
* **Node.js** (>= 18)
* **npm** (comes with Node.js)
* **Database**: SQLite (default) or PostgreSQL (optional)
* **Stripe CLI** (for local webhook testing)

---

## ⚙️ Environment Setup

Both backend and frontend include `.env.example` files.

### 1. Configure Environment Variables

Copy the example files and update values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update the variables such as:

* Django secret key
* Database configuration
* Stripe API keys
* Frontend API URL

---

## 🧩 Backend Setup (Django + Poetry)

```bash
cd backend

poetry env info

poetry env use python3.12 # Select Python version compatible with Django 5.2

# Install dependencies using Poetry
poetry install


### 📊 Database Setup

* Create a database
* Update `.env` with DB credentials

Example:

```env
DB_ENGINE="django.db.backends.postgresql"
DB_NAME=academyvault_db
DB_USER=root
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=3306
```

---

### 🔐 Generating Django Secret Key

You need a Django secret key for the backend. You can generate one using Python:

```bash
python3.12 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Make sure you are using python version that is supported by Django 5.2.
```

Copy the generated key and paste it into your `.env` file:

```env
DJANGO_SECRET_KEY=your_generated_secret_key
```

⚠️ Keep this key private and never commit it to version control.



### 🔄 Run Migrations

```bash
poetry run python manage.py migrate
```

(Optional) Create superuser for admin panel:

```bash
poetry run python manage.py createsuperuser
```

---

### ▶️ Run Backend Server

```bash
poetry run python manage.py runserver
```

Backend will run at:

```
http://127.0.0.1:8000/
```

---

## ⚛️ Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at:

```
http://localhost:5173/
```

---

## 🔗 Stripe Webhook Setup (Local Development)

To listen for Stripe events locally:

```bash
stripe listen --forward-to localhost:8000/api/webhook
```

Make sure to update your `.env` with the generated webhook secret.

---

## ✅ Notes

* Ensure backend is running before starting frontend
* Use test Stripe keys for development
* Do not commit `.env` files to version control

---

## 🌟 Key Highlights

* Full-stack architecture (Django + React)
* Real-world subscription system using Stripe
* Secure webhook-based payment handling
* Role-based content access (free vs premium)
* Admin-controlled content and subscription tiers

---

## 🔗 Future Improvements

* Email notifications for subscription events
* Content streaming (videos)
* User dashboard with progress tracking
* Deployment (Docker + CI/CD)

---

---

## 📄 License

This project is for educational and portfolio purposes.
