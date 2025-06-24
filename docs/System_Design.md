# ZorigHub System Design Document

## Implementation approach

ZorigHub is a digital platform that empowers Bhutanese youth artisans skilled in traditional crafts such as weaving, carving, and painting. The platform offers verified skills certification, eco-friendly packaging solutions, and access to global and tourism-focused markets. By integrating with existing handicraft associations, ZorigHub supports job creation, promotes sustainable livelihoods, and preserves Bhutan's cultural heritage. It blends technology with tradition to help young artisans thrive in a modern economy while staying rooted in their identity.

### Key Technical Challenges:

1. **Connectivity and Performance in Rural Areas**: Many artisans may have limited internet access, requiring offline capabilities and lightweight interfaces.

2. **Authentication and Verification**: Implementing a robust certification system that maintains cultural integrity while being digitally accessible.

3. **Payment Processing**: Supporting both local and international payment methods with currency conversion.

4. **Logistics Management**: Coordinating shipping from remote areas of Bhutan to global destinations.

5. **Multilingual Support**: Implementing interfaces in multiple languages to serve both local artisans and international buyers.

### Technology Stack Selection:

Based on the requirements, we recommend the following open-source technologies:

#### Frontend:

- **HTML/CSS**: For building a responsive, component-based user interface
- **Tailwind CSS**: For responsive, customizable design

#### Backend:

- **Node.js/Express**: For building a scalable API backend
- **MongoDB**: For flexible document storage (product descriptions, cultural stories)

#### File Storage:

- **AWS S3**: For storing images and media files

#### Authentication:

- **OAuth 2.0**: For authentication
- **JWT**: For secure token-based sessions
- **NDI Integration**: For authentication (Bhutanese)

#### Payment Processing:

- **Stripe/Paypal**: For international payments
- **mBOB/mPay/DK** (for Bhutanese payment methods)

#### Deployment & Infrastructure:

- **Docker**: For containerization
- **Kubernetes**: For orchestration
- **AWS/Azure/GCP**: For cloud hosting

#### Analytics & Monitoring:

- **Elasticsearch**: For search and analytics
- **Kibana**: For visualization

#### Communication:

- **Nodemailer**: For email notifications
- **Twilio**: For SMS notifications

## System Architecture Overview

### High-Level Architecture

The ZorigHub platform will follow a microservices architecture to ensure scalability and maintainability. The system will be divided into the following key components:

1. **Web Application**: HTML/CSS frontend providing interfaces for all user types
2. **API Gateway**: Entry point for all client requests, handling authentication and routing
3. **User Service**: Manages user accounts and profiles
4. **Certification Service**: Handles verification workflows and certification processes
5. **Product Service**: Manages product listings, inventory, and categories
6. **Order Service**: Processes orders, payments, and shipping
7. **Experience Service**: Manages tourism experiences and bookings
8. **Analytics Service**: Collects and processes platform metrics
9. **Notification Service**: Handles all communications (email, SMS, in-app)
10. **Search Service**: Powers product and artisan discovery
11. **Content Service**: Manages cultural content and educational resources
12. **Admin Service**: Provides platform management capabilities

### Database Schema

The platform will use **MongoDB** for content-rich data (product descriptions, cultural stories, artisan profiles)

### API Endpoints Structure

#### Authentication API

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password recovery
- `POST /api/auth/reset-password` - Reset password

#### User API

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

#### Artisan API

- `GET /api/artisans` - List artisans
- `GET /api/artisans/:id` - Get artisan profile
- `PUT /api/artisans/:id` - Update artisan profile
- `GET /api/artisans/:id/certifications` - Get artisan certifications

#### Certification API

- `POST /api/certifications/request` - Submit certification request
- `GET /api/certifications/requests/:id` - Get request details
- `PUT /api/certifications/requests/:id` - Update request
- `GET /api/certifications/:id/verify` - Verify certification

#### Product API

- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/products/:id/inventory` - Update inventory
- `GET /api/products/categories` - Get categories

#### Order API

- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/buyer/:id` - Get buyer orders
- `GET /api/orders/artisan/:id` - Get artisan orders
- `GET /api/orders/:id/tracking` - Get order tracking

#### Payment API

- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/:id/refund` - Process refund

#### Packaging API

- `GET /api/packaging/options` - List packaging options
- `GET /api/packaging/options/:id` - Get packaging details

#### Analytics API

- `GET /api/analytics/platform` - Get platform metrics
- `GET /api/analytics/artisan/:id` - Get artisan dashboard metrics
- `GET /api/analytics/certification/:id` - Get certification dashboard metrics

#### Support API

- `POST /api/support/tickets` - Create support ticket
- `GET /api/support/tickets/:id` - Get ticket details
- `PUT /api/support/tickets/:id` - Update ticket
- `POST /api/support/tickets/:id/responses` - Add response

#### Search API

- `GET /api/search/products` - Search products
- `GET /api/search/artisans` - Search artisans

### Security Considerations

1. **Authentication & Authorization**

   - JWT-based authentication with short expiry and refresh tokens
   - Role-based access control (RBAC) for different user types
   - Multi-factor authentication for admin and association users

2. **Data Protection**

   - Encryption of sensitive data at rest using AES-256
   - TLS/SSL for all data in transit
   - Data anonymization for analytics processing

3. **API Security**

   - Rate limiting to prevent abuse
   - Input validation and sanitization
   - OWASP Top 10 protection measures
   - API key management for third-party integrations

4. **Payment Security**

   - PCI DSS compliance for payment processing
   - RMA compliance for micro-loan processing
   - Tokenization of payment information
   - Fraud detection mechanisms

5. **Infrastructure Security**

   - Regular security audits and penetration testing
   - Container security scanning
   - Network security with proper firewall configuration
   - Comprehensive logging and monitoring

### Third-Party Integrations

1. **Payment Processing**

   - **Stripe**: For international credit card processing
   - **Bank of Bhutan (mBOB) Payment Gateway**: For local payment methods
   - **PayPal**: For additional international payment options

2. **Logistics & Shipping**

   - **Bhutan Post API**: For local shipping
   - **DHL/FedEx/UPS APIs**: For international shipping
   - **EasyShip**: For shipping rate comparison and label generation

3. **Analytics & Tracking**

   - **Google Analytics**: For web analytics
   - **Mixpanel**: For user behavior analysis
   - **Hotjar**: For heatmaps and user recordings

4. **Communication**

   - **Nodemailer**: For transactional emails
   - **Twilio**: For SMS notifications
   - **Firebase Cloud Messaging**: For push notifications

5. **Authentication**
   - **OAuth 2.0**: For identity management (optional)
   - **Google/Facebook OAuth**: For social login options

### Scalability Considerations

1. **Horizontal Scaling**

   - Stateless microservices for easy replication
   - Auto-scaling based on load patterns

2. **Database Scaling**

   - Read replicas for heavy read operations
   - Sharding strategies for future growth

3. **Caching Strategy**

   - Multi-level caching (CDN, Application, Database)
   - Redis for frequently accessed data

4. **Resilience**

   - Circuit breaker patterns for service dependencies
   - Retry mechanisms with exponential backoff
   - Fallback mechanisms for critical services

5. **Performance Optimization**
   - Image optimization pipeline
   - Lazy loading of non-critical resources
   - Efficient pagination for large result sets

## Anything UNCLEAR

1. **Payment Processing in Bhutan**

   - Need to clarify which local payment gateways in Bhutan can be integrated and their API capabilities.
   - Currency conversion handling and settlement processes need verification.

2. **Shipping & Logistics**

   - Detailed information needed about shipping services available in rural Bhutan.
   - Last-mile delivery options and their reliability need to be confirmed.

3. **Internet Connectivity**

   - More specific data needed on internet availability and bandwidth in target artisan regions to optimize offline capabilities.

4. **Certification Standards**

   - Need clarification on the exact certification criteria for different craft types.
   - Need to understand if there are existing digital certification systems that should be integrated with.

5. **Data Sovereignty**
   - Need to verify Bhutanese data protection regulations and ensure compliance.
   - Clarify if data needs to be physically hosted in specific regions.
