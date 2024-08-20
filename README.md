# SwiftShop Admin Panel

This project is an admin panel for managing the SwiftShop e-commerce site. The panel provides functionalities to manage products, categories, and orders, and includes authentication for admin users.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **Dashboard**:
 ![dashboard-admin](https://github.com/user-attachments/assets/519ff144-7f7f-424f-8242-6d6a447c443b)

- **Product Management**:
 ![products page - admin](https://github.com/user-attachments/assets/7719f97b-cae2-41f9-928b-c4921ac19545)

  - Add new products
   ![new product - admin](https://github.com/user-attachments/assets/463298f5-5faa-4086-a127-6f57375d4c50)

  - Edit existing products
  ![edit products - admin](https://github.com/user-attachments/assets/b0bb5b58-9183-4124-8b83-60e8efad81af)
 
  - 
![popup notifications - admin](https://github.com/user-attachments/assets/937ccf0d-08af-463a-83cd-544e2bab989d)

  - Delete products
 ![delete product - admin](https://github.com/user-attachments/assets/6040a23a-cdda-4b4f-9f27-91c1db957312)

- **Category Management**:
  - Add and manage categories for organizing products
    ![categories admin](https://github.com/user-attachments/assets/c16f39df-cfb7-41fb-b143-ed3fedc76f50)

- **Order Management**:
  - View and manage customer orders

    ![orders- admin](https://github.com/user-attachments/assets/29b5950f-dd49-4864-98d9-8abff1018c3b)

- **Authentication**:
  - Admin login using Google via NextAuth

    ![login with google screen](https://github.com/user-attachments/assets/45e9a562-174b-4b4a-8872-c498ec529b8a)

- **Image Storage**:
  - Product images stored securely using AWS S3

## Technologies Used

- **Next.js**: React framework for server-rendered applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **NextAuth**: Authentication for Next.js applications, supporting Google OAuth.
- **AWS S3**: Cloud storage service for storing product images.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nikkittaa/ecommerce-admin.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ecommerce-admin
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3000` to access the admin panel.
