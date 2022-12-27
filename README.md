# Saladbox

## ✨ The project description
Saladbox can make both salad-addict and unexciting-salad people think salad is cool. Based on basic salad component including 3 parts, vegetables - topping - sauce. Choose your favorite ingredients, create your own salad recipes and take it in your weekly meal plan order. This service ecommerce application will makes people think more fascinating when they think about ordering salads. 

## ✨ User story

### 1. Authentication

- [x] - User can sign in with email and password
- [x] - User can register for a new account by email and password
- [x] - User can stay signed in with refreshing page

### 2. User

- [x] - User can see their own infomation in profile page
- [x] - User can edit some of their specific information
- [x] - User can deative their account

### 3. Product

- [x] - User can see a list of product: by search, filter, pagination
- [x] - User can see detail single product, in a seperate page
- [x] - User can add product to favorite list or remove it
- [x] - User can choose a weekly meal plan or custom it with all product, favorite list or from the custom single product
- [x] - User can custom a product with three easy steps
- [x] - As a Admin, i can create a new product
- [x] - As a Admin, i can update a product
- [x] - As a Admin, i can delete a product

### 4. Category

- [x] - User can see list of category
- [x] - User can see category and detailed sections
- [x] - User can filter a product by category
- [x] - As a Admin, i can create new category
- [x] - As a Admin, i can update a category
- [x] - As a Admin, i can deactive a category

### 5. Order

- [x] - Authenticated user can create an order
- [x] - Authenticated user can see detail infomation of the single order
- [x] - Authenticated user can edit the order
- [x] - Authenticated checking order with status
- [x] - Authenticated user can delete the order
- [x] - As a Admin, i can change status of order
- [x] - As a Admin, i can cancel order of user

### 6. Ingredient

- [x] - Admin can create an ingredient
- [x] - Admin can update an ingredient
- [x] - Admin can edit the ingredient
- [x] - Admin  can delete the ingredient


## ****✨**** API Endpoint

### Auth APIs

```jsx
/**
* @route POST /auth/login
* @description Log in with username and password
* @body { email, password}
* @access Public
*/
```

### User APIs

```jsx
/**
* @route POST /users
* @description Register new user
* @body {name, enail, password)
* @access Public
*/
```

```jsx
/**
* @route GET /users/me
* @description Get user profile page
* @access Login required
*/
```

```jsx
/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body {name, phone, address, avatarURL, aboutme}
 * @access Login required
 */
```

```jsx
/**
 * @route DELETE /me/delete
 * @description Deactive account user
 * @access Login required
 */
```

```jsx
/**
* @route GET /users?page=10&limit=1
* @description Get all user
* @access Admin Login required
*/
```

### Product APIs

```jsx
/**
 * @route GET /products
 * @description Get all product with pagination
 * @access Public
 */
```

```jsx
/**
 * @route GET /products/admin
 * @description Get all product with pagination
 * @access Public
 */
```

```jsx
/**
 * @route GET /products/:id
 * @description Get single product
 * @access Public
 */
```

```jsx
/**
 * @route PUT /products/:id
 * @description Edit infomation of product
 * @body name, decription, image
 * @access Admin Login required
 */
```

```jsx
/**
 * @route POST /products
 * @description Create new product
 * @access Admin Login required
 */
```

```jsx
/**
 * @route POST /products
 * @description Create custom product
 * @body name, decription, image
 * @access  Login required
 */
```

```jsx
/**
 * @route DELETE /products/:id
 * @description Delete product
 * @access Admin Login required
 */
```

### Category APIs

```jsx
/**
 * @route POST /category
 * @description Create a category
 * @body 
 * @access Login required
 */
```

```jsx
/**
 * @route GET /category
 * @description Get category
 * @access public
 */
```

```jsx
/**
 * @route GET /category/:id
 * @description Get a single category
 * @access public
 */
```

```jsx
/**
 * @route PUT /category/:id
 * @description Update category
 * @body 
 * @access Login required
 */
```

```jsx
/**
 * @route DELETE /category/:id
 * @description Delete category
 * @access Login required
 */
```

### Order APIs

```jsx
/**
 * @route POST /oders
 * @description Create a new Orders
 * @body {productName,userName,amount}
 * @access Login required
 */
```

```jsx
/**
 * @route GET /oders?page=1&limit=10
 * @description Get orders with pagination
 * @access Admin Login required
 */
```

```jsx
/**
 * @route GET /oders/:id
 * @description Get a single order
 * @access Admin Login required
 */
```

```jsx
/**
 * @route PUT /oders
 * @description Update the orders
 * @body 
 * @access Login required
 */
```

```jsx
/**
 * @route DELETE /oders/:id
 * @description Delete a oder
 * @access Login required
 */
```

### Ingredient API

```jsx
/**
 * @route POST /ingredient
 * @description Create a new ingredient
 * @body {name, image, price, calo, step, type}
 * @access Admin Login required
 */
```

```jsx
/**
 * @route GET /ingredient?page=1&limit=10
 * @description Get ingredient with pagination
 * @access public
 */
```

```jsx
/**
 * @route PUT /ingredient
 * @description Update the ingredient
 * @body {name, image, price, calo, step, type}
 * @access Admin Login required
 */
```

```jsx
/**
 * @route DELETE /ingredient/:id
 * @description Delete a ingredient
 * @access Admin Login required
 */
```

## ****✨**** Diagram Relation

![](https://i.imgur.com/fg0IOTl.png)






