
A comprehensive system for managing restaurant accounts, tracking interactions, and monitoring performance metrics.

## 🚀 Features

- Account/Lead Management
- Contact Management
- Interaction Tracking
- Order Management
- Performance Analytics
- Call Planning & Scheduling

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React, TypeScript
- **Database**: MongoDB with Mongoose
- **Testing**: Jest, Supertest
- **Authentication**: JWT
- **CI/CD**: Jenkins
- **Containerization**: Docker

## 🚀 Installation Methods

### 1. Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/abhishekchauhan15/super-duper-octo-parakeet.git
```
2. **Change the directory**
```bash
cd super-duper-octo-parakeet
```

3. **Install dependencies**
```bash
npm install
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Start development server**
```bash
npm run dev
```

6. **Move to client frontend**
```bash
cd client
```

7. **start client frontend**
```bash
npm run dev
```

### 2. Docker Setup


1. **Docker Setup (Recommended)**
```bash
# Pull the image
docker pull 1509abhishek/kam-app

# Run container
docker run -d -p 3000:3000 kam-app

```

## 🔄 CI/CD Setup

The project uses a dual CI/CD pipeline setup:

### Jenkins Integration
The project is configured with Jenkins for automated builds and deployments:

- **GitHub Integration**: 
  - Configured with GitHub webhooks
  - Triggers builds on every commit

- **Build Process**:
  - Automated dependency installation
  - TypeScript compilation
  - Linting and formatting checks
  - Test execution with coverage reports

- **Deployment Stages**:
  - Automatic staging deployment
  - Production deployment with manual approval
  - Docker image building and registry pushing

To access the Jenkins dashboard:
```
URL: http://35.175.136.171:8080
Project: KAM
```

## 📝 API Documentation


### Postman Collection
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/24775685-12413263-7ca4-4d85-b88c-2d42f2580497?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D24775685-12413263-7ca4-4d85-b88c-2d42f2580497%26entityType%3Dcollection%26workspaceId%3D2424e103-042f-4749-9d5c-8db76276953a)

### Authentication Endpoints

```
POST /api/users/register
POST /api/users/login
```

### Lead Management
```
GET    /api/leads                    - Get all leads
POST   /api/leads                    - Create new lead
GET    /api/leads/:id                - Get lead by ID
PATCH  /api/leads/:id                - Update lead
DELETE /api/leads/:id                - Delete lead
GET    /api/leads/call-planning/today - Get leads requiring calls today
```

### Contact Management
```
POST   /api/contacts                 - Add new contact
GET    /api/contacts/:leadId         - Get contacts for a lead
```

### Interaction Management
```
POST   /api/interactions             - Add new interaction
GET    /api/interactions/:leadId     - Get interactions for a lead
```

### Order Management
```
POST   /api/orders                   - Create new order
GET    /api/orders/:leadId           - Get orders for a lead
```

### Performance Analytics
```
GET    /api/performance              - Get well-performing accounts
GET    /api/performance/underperforming - Get underperforming accounts
GET    /api/performance/patterns/:leadId - Get ordering patterns for a lead
```


## 🔄 CI/CD Pipeline

Our GitHub Actions pipeline includes:

1. **Code Quality**
   - TypeScript compilation
   - ESLint checks
   - Prettier formatting

2. **Testing**
   - Unit tests
   - Integration tests
   - Coverage reports

3. **Security**
   - Dependency scanning
   - Code scanning
   - Security best practices

4. **Deployment**
   - Automated deployment to staging
   - Manual approval for production
   - Environment configuration

## 🚀 Populate database with sample data

```bash
npm run populate
```


## 📊 Data Models

### Lead
- Name
- Address
- Type (Restaurant/Dhaba)
- Status
- Call Frequency
- Points of Contact
- Next Call Date
- Preferred Timezone

### Contact
- Name
- Role
- Phone Number
- Email
- Preferred Contact Time
- Notes

### Interaction
- Type
- Duration
- Notes
- Date
- User ID
- Lead ID

### Order
- Amount
- Status
- Name
- Quantity
- Delivery Date
- Lead ID

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## 🧪 Testing

Run different types of tests:
```bash
# Run all tests
npm run test

# Unit test coverage
npx jest ./src/test/fileName.test.ts
eg: npx jest ./src/test/user.test.ts
```
