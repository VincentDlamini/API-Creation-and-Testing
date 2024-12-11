const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const customers = [
    {
        id: 1,
        firstName: "Bongani",
        lastName: "Dlamini",
        email: "BonganiD@yahoo.com",
        password: "Bongani@123",
        address: "123 John Doe Street",
        city: "Johannesburg",
        province: "Gauteng",
        postalCode: 2001,
        country: "South Africa"
    },
    {
        id: 2,
        firstName: "Tebogo",
        lastName: "Zondo",
        email: "TZ@yahoo.com",
        password: "TZ@123",
        address: "123 John Doe Street",
        city: "Liverpool",
        province: "London",
        postalCode: 56358,
        country: "England"
    }
];

const products = [
    {
        id: 1,
        productName: "Honor Band 9",
        productDescription: "Black Band",
        price: 19.55,
        quantityOnHand: 120,
        categoryId: 302
    },
    {
        id: 2,
        productName: "Lenovo Ideapad",
        productDescription: "Core i3 500GB",
        price: 5149.12,
        quantityOnHand: 10,
        categoryId: 301
    }
];

const categories = [
    { id: 1, categoryName: "Games" },
    { id: 2, categoryName: "Laptops" },
    { id: 3, categoryName: "Watches" },
    { id: 4, categoryName: "Internet Routers" }
];

const orders = [
    {
        id: 1,
        customerId: 100,
        orderDate: new Date(),
        totalCost: 100.28
    }
];

const orderedItems = [
    {
        id: 1,
        orderId: 400,
        productId: 200,
        quantity: 2,
        unitPrice: 300.22
    }
];

const payments = [
    {
        id: 1,
        orderId: 400,
        paymentMethod: "Credit Card",
        paymentDate: new Date(),
        amount: 415.24
    }
];

// Base route
app.get('/', (req, res) => {
    res.send('Hello, Vin-online-shopping!');
});

// Validation functions
function validateCustomer(customer) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        postalCode: Joi.number().integer().required(),
        country: Joi.string().required()
    });
    return schema.validate(customer);
}

function validateProduct(product) {
    const schema = Joi.object({
        productName: Joi.string().required(),
        productDescription: Joi.string().required(),
        price: Joi.number().required(),
        quantityOnHand: Joi.number().integer().required(),
        categoryId: Joi.number().integer().required()
    });
    return schema.validate(product);
}

function validateCategory(category) {
    const schema = Joi.object({
        categoryName: Joi.string().required()
    });
    return schema.validate(category);
}

function validateOrder(order) {
    const schema = Joi.object({
        customerId: Joi.number().integer().required(),
        orderDate: Joi.date().required(),
        totalCost: Joi.number().required()
    });
    return schema.validate(order);
}

function validateOrderItem(orderItem) {
    const schema = Joi.object({
        orderId: Joi.number().integer().required(),
        productId: Joi.number().integer().required(),
        quantity: Joi.number().integer().required(),
        unitPrice: Joi.number().required()
    });
    return schema.validate(orderItem);
}

function validatePayment(payment) {
    const schema = Joi.object({
        orderId: Joi.number().integer().required(),
        paymentMethod: Joi.string().required(),
        paymentDate: Joi.date().required(),
        amount: Joi.number().required()
    });
    return schema.validate(payment);
}


// Customers
app.get('/customers', (req, res) => res.send(customers));
app.get('/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});
app.post('/customers', (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = { id: customers.length + 1, ...req.body };
    customers.push(customer);
    res.send(customer);
});
app.put('/customers/:id', (req, res) => {
    // Look up the customer, and if not existing, return 404
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) {
        return res.status(404).send({ error: 'Customer ID not found' });
    }

    // Ensure request body is not empty
    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: 'Request body is empty' });
    }

    // Validate input; if invalid, return 400 - Bad Request
    const { error } = validateCustomer(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Update customer fields dynamically
    Object.keys(req.body).forEach((key) => {
        if (customer.hasOwnProperty(key)) {
            customer[key] = req.body[key];
        }
    });

    // Return the updated customer with a success message
    res.send({ message: 'Customer updated successfully', customer });
});
app.delete('/customers/:id', (req, res) => {
    // Look up the customer, and if not found, return 404
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) {
        return res.status(404).send({ error: 'Customer ID not found' });
    }

    // Delete the customer
    const index = customers.indexOf(customer);
    customers.splice(index, 1);

    // Return a success message with the deleted customer
    res.send({ message: 'Customer deleted successfully', customer });
});


// Products
app.get('/products', (req, res) => res.send(products));
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Product not found');
    res.send(product);
});
app.post('/products', (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const product = { id: products.length + 1, ...req.body };
    products.push(product);
    res.send(product);
});
app.put('/products/:id', (req, res) => {
    // Look up the product, and if not existing, return 404
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).send({ error: 'Product ID not found' });
    }

    // Ensure request body is not empty
    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: 'Request body is empty' });
    }

    // Validate input; if invalid, return 400 - Bad Request
    const { error } = validateProduct(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Update product fields dynamically
    Object.keys(req.body).forEach((key) => {
        if (product.hasOwnProperty(key)) {
            product[key] = req.body[key];
        }
    });

    // Return the updated product with a success message
    res.send({ message: 'Product updated successfully', product });
});
app.delete('/products/:id', (req, res) => {
    // Look up the product, and if not found, return 404
    const product = products.find(c => c.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).send({ error: 'Product ID not found' });
    }

    // Delete the product
    const index = products.indexOf(product);
    products.splice(index, 1);

    // Return a success message with the deleted product
    res.send({ message: 'Product deleted successfully', product });
});


// Categories
app.get('/categories', (req, res) => res.send(categories));
app.get('/categories/:id', (req, res) => {
    const category = categories.find(ct => ct.id === parseInt(req.params.id));
    if (!category) return res.status(404).send('Category not found');
    res.send(category);
});
app.post('/categories', (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = { id: categories.length + 1, ...req.body };
    categories.push(category);
    res.send(category);
});
app.put('/categories/:id', (req, res) => {
    // Look up the category, and if not existing, return 404
    const category = categories.find(c => c.id === parseInt(req.params.id));
    if (!category) {
        return res.status(404).send({ error: 'Category ID not found' });
    }

    // Ensure request body is not empty
    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: 'Request body is empty' });
    }

    // Validate input; if invalid, return 400 - Bad Request
    const { error } = validateCategory(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Update category fields dynamically
    Object.keys(req.body).forEach((key) => {
        if (category.hasOwnProperty(key)) {
            category[key] = req.body[key];
        }
    });

    // Return the updated category with a success message
    res.send({ message: 'Category updated successfully', category });
});
app.delete('/categories/:id', (req, res) => {
    // Look up the category, and if not found, return 404
    const category = categories.find(ct => ct.id === parseInt(req.params.id));
    if (!category) {
        return res.status(404).send({ error: 'Category ID not found' });
    }

    // Delete the category
    const index = categories.indexOf(category);
    categories.splice(index, 1);

    // Return a success message with the deleted category
    res.send({ message: 'Category deleted successfully', category });
});


// Orders
app.get('/orders', (req, res) => res.send(orders));
app.get('/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) return res.status(404).send('Order not found');
    res.send(order);
});
app.post('/orders', (req, res) => {
    const { error } = validateOrder(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const order = { id: orders.length + 1, ...req.body };
    orders.push(order);
    res.send(order);
});
app.put('/orders/:id', (req, res) => {
    // Look up the order, and if not existing, return 404
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).send({ error: 'Orders ID not found' });
    }

    // Ensure request body is not empty
    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: 'Request body is empty' });
    }

    // Validate input; if invalid, return 400 - Bad Request
    const { error } = validateOrder(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Update order fields dynamically
    Object.keys(req.body).forEach((key) => {
        if (order.hasOwnProperty(key)) {
            order[key] = req.body[key];
        }
    });

    // Return the updated order with a success message
    res.send({ message: 'Order updated successfully', order });
});
app.delete('/orders/:id', (req, res) => {
    // Look up the order, and if not found, return 404
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).send({ error: 'Order ID not found' });
    }

    // Delete the order
    const index = orders.indexOf(order);
    orders.splice(index, 1);

    // Return a success message with the deleted order
    res.send({ message: 'Order deleted successfully', order });
});


// OrderedItems
app.get('/orderedItems', (req, res) => res.send(orderedItems));
app.get('/orderedItems/:id', (req, res) => {
    const orderedItem = orderedItems.find(o => o.id === parseInt(req.params.id));
    if (!orderedItem) return res.status(404).send('Order not found');
    res.send(orderedItem);
});
app.post('/orderedItems', (req, res) => {
    const { error } = validateOrderItem(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const orderedItem = { id: orders.length + 1, ...req.body };
    orderedItems.push(orderedItem);
    res.send(orderedItem);
});
app.put('/orderedItems/:id', (req, res) => {
    // Look up the ordered item, and if not existing, return 404
    const orderedItem = orderedItems.find(ot => ot.id === parseInt(req.params.id));
    if (!orderedItem) {
        return res.status(404).send({ error: 'OrderedItem ID not found' });
    }

    // Ensure request body is not empty
    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: 'Request body is empty' });
    }

    // Validate input; if invalid, return 400 - Bad Request
    const { error } = validateOrderItem(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Update order fields dynamically
    Object.keys(req.body).forEach((key) => {
        if (orderedItem.hasOwnProperty(key)) {
            orderedItem[key] = req.body[key];
        }
    });

    // Return the updated Ordered Item with a success message
    res.send({ message: 'Ordered Item updated successfully', orderedItem });
});
app.delete('/orderedItems/:id', (req, res) => {
    // Look up the ordered item, and if not found, return 404
    const orderedItem = orderedItems.find(ot => ot.id === parseInt(req.params.id));
    if (!orderedItem) {
        return res.status(404).send({ error: 'Ordered Item ID not found' });
    }

    // Delete the Ordered Items
    const index = orderedItems.indexOf(orderedItem);
    orderedItems.splice(index, 1);

    // Return a success message with the deleted Ordered Item
    res.send({ message: 'Ordered Item deleted successfully', orderedItem });
});


// Payments
app.get('/payments', (req, res) => res.send(payments));
app.get('/payments/:id', (req, res) => {
    const payment = payments.find(p => p.id === parseInt(req.params.id));
    if (!payment) return res.status(404).send('Payment not found');
    res.send(payment);
});
app.post('/payments', (req, res) => {
    const { error } = validatePayment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const payment = { id: payments.length + 1, ...req.body };
    payments.push(payment);
    res.send(payment);
});
app.put('/payments/:id', (req, res) => {
    // Look up the payment, and if not existing, return 404
    const payment = payments.find(p => p.id === parseInt(req.params.id));
    if (!payment) {
        return res.status(404).send({ error: 'Payment ID not found' });
    }

    // Ensure request body is not empty
    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: 'Request body is empty' });
    }

    // Validate input; if invalid, return 400 - Bad Request
    const { error } = validatePayment(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    // Update order fields dynamically
    Object.keys(req.body).forEach((key) => {
        if (payment.hasOwnProperty(key)) {
            payment[key] = req.body[key];
        }
    });

    // Return the updated Payment with a success message
    res.send({ message: 'Payment updated successfully', payment });
});
app.delete('/payments/:id', (req, res) => {
    // Look up the payment, and if not found, return 404
    const payment = payments.find(ot => ot.id === parseInt(req.params.id));
    if (!payment) {
        return res.status(404).send({ error: 'Payment ID not found' });
    }

    // Delete the Payment
    const index = payments.indexOf(payment);
    payments.splice(index, 1);

    // Return a success message with the deleted Payment
    res.send({ message: 'Payment deleted successfully', payments });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
