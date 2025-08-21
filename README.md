# Product Inventory System (Node.js + Express + MongoDB)

A small REST API to manage products, plus an Algorithms Sprint demonstrating **QuickSort** (custom, non-mutating) and **Binary Search** (exact-match on a sorted array).

## Table of Contents
- [Product Inventory System (Node.js + Express + MongoDB)](#product-inventory-system-nodejs--express--mongodb)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [Run](#run)
- [Server: http://localhost:3000](#server-httplocalhost3000)
- [Health: GET /health -\> { "ok": true, "uptime": ... }](#health-get-health----ok-true-uptime--)
  - [API](#api)
    - [Example requests](#example-requests)
- [Create](#create)
- [Sort by price (desc)](#sort-by-price-desc)
- [Binary search exact name (URL-encoded)](#binary-search-exact-name-url-encoded)
  - [Algorithms](#algorithms)
  - [Testing](#testing)
  - [Design Notes \& Tradeoffs](#design-notes--tradeoffs)
  - [Future Improvements](#future-improvements)
  - [Wins and Challenges](#wins-and-challenges)
    - [Wins](#wins)
    - [Challenges](#challenges)

## Quick Start

1. Clone repo and install dependencies:
   
   git close <repo-url>
   cd product-inventory-system
   npm install
   
2. Create `.env` from `.env.example` and set:
   
   MONGODB_URI=mongodb://127.0.0.1:27017/product_inventory
   PORT=3000
   
3. Ensure MongoDB is running locally (or use Atlas and update `MONGODB_URI`).

## Run

npm run dev


# Server: http://localhost:3000
# Health: GET /health -> { "ok": true, "uptime": ... }


## API
Base path: `/api/products`

| Method | Path                         | Description                          | Body (JSON)                                      |
|-------:|------------------------------|--------------------------------------|--------------------------------------------------|
| GET    | `/`                          | List all products                    | —                                                |
| POST   | `/`                          | Create product                       | `{ name, category, price, quantity }`            |
| GET    | `/:id`                       | Get one by Mongo `_id`               | —                                                |
| PUT    | `/:id`                       | Update fields                        | `{ price?, quantity?, category? }`               |
| DELETE | `/:id`                       | Delete by `_id`                      | —                                                |
| GET    | `/sort/:key?order=asc|desc` | **QuickSort** by key                 | —                                                |
| GET    | `/search/:key/:value`        | **Binary Search** (exact match)      | —                                                |

**Valid keys:** `name`, `category`, `price`, `quantity`  
**Note:** Binary Search sorts the in-memory array **ASC by that key** first, then searches.

### Example requests

# Create
curl -X POST http://localhost:3000/api/products   -H "Content-Type: application/json"   -d '{"name":"Banana Bunch (6)","category":"produce","price":2.49,"quantity":120}'

# Sort by price (desc)
curl -s http://localhost:3000/api/products/sort/price?order=desc

# Binary search exact name (URL-encoded)
curl -s "http://localhost:3000/api/products/search/name/banana%20bunch%20(6)"


## Algorithms 
Both algorithms are also exposed via routes, so you can test them without looking at the code.

- **QuickSort Pseudocode **: custom, non-mutating, compares numbers arithmetically and strings case-insensitively.  
  1. Choose a pivot (middle element).
  2. Partition array into < pivot and >= pivot.
  3. Recursively sort partitions.
  4. Concatenate results (left + pivot + right).
  
  - Average time: **O(n log n)**, Worst: **O(n²)** (rare, bad pivot cases).  
  - File: `utils/quicksort.js`
  
- **Binary Search Pseudocode**: exact-match search on a list **sorted by the same key (ASC)**.  
  1. Sort array ASC by key
  2. Set low=0, high=arr.length-1
  3. While low <= high:
   - mid = (low+high)/2
   - if arr[mid] == target → return index.
   - if arr[mid] < target → search right.
   - else → search left.
  4. If not found, return -1.

  - Time: **O(log n)**  
  - File: `utils/binarySearch.js`
  
- **Comparator**: shared helper handling strings vs numbers, case-insensitive for strings.  
  - File: `utils/compareByKey.js`

## Testing
- Unit tests (algorithms):
  
  npm test
  
  - Files: `test/quicksort.test.js`, `test/binarySearch.test.js`
- (Optional) Integration tests with `supertest` can be added to hit routes.

## Design Notes & Tradeoffs
- **Educational focus**: sorting/searching are done in app code to demonstrate algorithms.  
  In production you’d often use MongoDB’s `.sort()` and query operators for performance.
- **Non-mutating QuickSort** keeps original arrays intact, which is safer.
- **Exact-match** Binary Search keeps the logic simple and predictable.

## Future Improvements
- Partial/substring search for names (`/search/contains/:key/:term` using regex).
- Range queries (`price>=X & <=Y`).
- Input validation middleware (e.g., Zod or Joi).
- E2E tests (supertest) and code coverage.
- Pagination on `/api/products` for large datasets.

## Wins and Challenges

### Wins
- Practiced **Morgan logger** instead of a custom console logger for learning purposes.
- Created a **separate database connection file** (`db.js`) to keep MongoDB connection logic isolated and improve error handling (e.g., calling `process.exit(1)` if the connection fails).
- Added a **Health Route** to quickly verify the API is running.
  - **How to use:** Once connected to the database, run `npm start` (or `node server.js`) in your terminal, then visit [http://localhost:3000/health](http://localhost:3000/health).
  - Returns: `{ ok: true, uptime: <seconds> }`, showing the server is up.
  - Also displays **404** and **200** status codes in the terminal due to Morgan logging.
- In controllers, used `.lean()` so Mongoose returns **plain JavaScript objects** instead of full Mongoose documents. This is faster and ideal.
- Used **basic HTTP status codes** (e.g., `200`, `404`) instead of string descriptions for better performance, easier reading, and fewer errors.
- Learned how to do a **/seed** for bulk inputting data on thunder client for faster testing
- Stuck with Trello for student organization skills 
 [My trello workspace](https://trello.com/invite/b/68978276d4761946e452e6c0/ATTI89546435f6d85c5e45bd72a03c81e1abA2AAE497/product-inventory-system)

### Challenges
- Setting up bulk product insertion for testing required careful JSON formatting.
- Needed to debug 404 errors when posting data — resolved by adding the correct POST route for seeding data.
- Managing file paths for tests and utilities (e.g., `utils/` instead of `src/utils/`) to avoid module import errors.
- Being consistent in error handling messages. Learned that you can do a function send500() for a cleaner file, but kept it without for learning purposes.