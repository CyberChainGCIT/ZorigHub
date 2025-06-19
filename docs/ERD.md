```mermaid
erDiagram
    User {
        UserID PK
        Username
        Password_hashed
        Email
        Role
        ProfilePictureURL
        DateJoined
        LastLogin
    }

    Address {
        AddressID PK
        UserID FK
        Street
        City
        StateProvince
        PostalCode
        Country
        AddressType
    }

    Artisan {
        UserID PK_FK "FK to User.UserID"
        ProfileDescription
        CraftSpecialization
        YearsOfExperience
    }

    PortfolioItem {
        PortfolioItemID PK
        ArtisanUserID FK "FK to User.UserID"
        ItemName
        Description
        ImageURL
        DateAdded
    }

    Product {
        ProductID PK
        ArtisanUserID FK "FK to User.UserID"
        Name
        Description
        Price
        CategoryID FK
        CraftTypeID FK
        Images
        StockQuantity
        DateAdded
        LastUpdated
    }

    Category {
        CategoryID PK
        Name
        Description
    }

    CraftType {
        CraftTypeID PK
        Name
        Description
    }

    Order {
        OrderID PK
        BuyerUserID FK "FK to User.UserID"
        OrderDate
        TotalAmount
        Status
        ShippingAddressID FK "FK to Address.AddressID"
        BillingAddressID FK "FK to Address.AddressID"
        TrackingNumber
    }

    OrderItem {
        OrderItemID PK
        OrderID FK
        ProductID FK
        Quantity
        PriceAtPurchase
    }

    Payment {
        PaymentID PK
        OrderID FK
        PaymentIntentID
        Amount
        Currency
        PaymentDate
        Status
        PaymentMethod
    }

    CertificationRequest {
        CertificationRequestID PK
        ArtisanUserID FK "FK to User.UserID"
        AssociationUserID FK "FK to User.UserID"
        RequestDate
        Status
        RequestDetails
    }

    Certification {
        CertificationID PK
        CertificationRequestID FK
        ArtisanUserID FK "FK to User.UserID"
        CertificationName
        IssuingBody
        DateIssued
        ExpiryDate
        Status
    }

    Experience {
        ExperienceID PK
        ArtisanUserID FK "FK to User.UserID"
        Name
        Description
        Location
        Duration
        Price
        Availability
        Images
    }

    Booking {
        BookingID PK
        ExperienceID FK
        BuyerUserID FK "FK to User.UserID"
        BookingDate
        NumberOfParticipants
        TotalPrice
        Status
    }

    SupportTicket {
        TicketID PK
        UserID FK
        Subject
        Description
        Status
        DateCreated
        LastUpdated
        Priority
    }

    SupportTicketResponse {
        ResponseID PK
        TicketID FK
        ResponderUserID FK "FK to User.UserID"
        Message
        DateCreated
    }

    PackagingOption {
        PackagingOptionID PK
        Name
        Description
        Material
        Cost
        ImageURL
    }

    ProductPackagingOption {
        ProductID PK_FK "FK to Product.ProductID"
        PackagingOptionID PK_FK "FK to PackagingOption.PackagingOptionID"
    }

    User ||--o{ Address : "has"
    User ||--|| Artisan : "is_a" // UserID in Artisan is PK and FK to User.UserID
    Artisan ||--o{ PortfolioItem : "has_portfolio"
    Artisan ||--o{ Product : "lists"
    Category ||--o{ Product : "categorizes"
    CraftType ||--o{ Product : "has_craft_type"
    User ||--o{ Order : "places" // Buyer role
    Order ||--|{ OrderItem : "contains" // An order must have at least one item
    Product ||--o{ OrderItem : "is_part_of" // A product can be in many order items
    Order ||--|| Payment : "has_payment" // One order has one payment
    Address ||--o{ Order : "ships_to_shipping_address" // An address can be a shipping addr for 0+ orders
    Address ||--o{ Order : "bills_to_billing_address" // An address can be a billing addr for 0+ orders
    Artisan ||--o{ CertificationRequest : "requests"
    User ||--o{ CertificationRequest : "handles_request" // Association role
    CertificationRequest ||--o| Certification : "results_in" // A request can lead to 0 or 1 certification
    Artisan ||--o{ Certification : "holds"
    Artisan ||--o{ Experience : "offers"
    Experience ||--o{ Booking : "has_booking"
    User ||--o{ Booking : "makes_booking" // Buyer role
    User ||--o{ SupportTicket : "creates_ticket"
    SupportTicket ||--o{ SupportTicketResponse : "has_response"
    User ||--o{ SupportTicketResponse : "responds_to_ticket" // Responder role
    Product ||--o{ ProductPackagingOption : "uses_packaging_option_through"
    PackagingOption ||--o{ ProductPackagingOption : "is_option_for_product_through"
```
