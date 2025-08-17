ALTER TABLE product
ADD COLUMN min_stock INTEGER DEFAULT 0 NOT NULL;

UPDATE product SET min_stock = 5 WHERE name = 'Laptop Pro';
UPDATE product SET min_stock = 2 WHERE name = 'Office Desk';
UPDATE product SET min_stock = 10 WHERE name = 'Running Shoes';
UPDATE product SET min_stock = 50 WHERE name = 'Organic Apples';
UPDATE product SET min_stock = 20 WHERE name = 'Teddy Bear';
UPDATE product SET min_stock = 15 WHERE name = 'Fantasy Novel';
UPDATE product SET min_stock = 10 WHERE name = 'Soccer Ball';
UPDATE product SET min_stock = 20 WHERE name = 'Shampoo';
UPDATE product SET min_stock = 10 WHERE name = 'Car Charger';
UPDATE product SET min_stock = 30 WHERE name = 'Vitamin C';

UPDATE product SET min_stock = 8 WHERE name = 'Bluetooth Headphones';
UPDATE product SET min_stock = 1 WHERE name = 'Dining Table';
UPDATE product SET min_stock = 5 WHERE name = 'Winter Jacket';
UPDATE product SET min_stock = 40 WHERE name = 'Milk';
UPDATE product SET min_stock = 10 WHERE name = 'RC Car';
UPDATE product SET min_stock = 10 WHERE name = 'Science Textbook';
UPDATE product SET min_stock = 15 WHERE name = 'Yoga Mat';
UPDATE product SET min_stock = 10 WHERE name = 'Face Cream';
UPDATE product SET min_stock = 15 WHERE name = 'Wiper Blades';
UPDATE product SET min_stock = 50 WHERE name = 'Pain Reliever';

UPDATE product SET min_stock = 5 WHERE name = 'Smartphone';
UPDATE product SET min_stock = 3 WHERE name = 'Bookshelf';
UPDATE product SET min_stock = 9 WHERE name = 'Jeans';
UPDATE product SET min_stock = 30 WHERE name = 'Bread';
UPDATE product SET min_stock = 10 WHERE name = 'Lego Set';
UPDATE product SET min_stock = 10 WHERE name = 'Mystery Novel';
UPDATE product SET min_stock = 5 WHERE name = 'Tennis Racket';
UPDATE product SET min_stock = 20 WHERE name = 'Lipstick';
UPDATE product SET min_stock = 20 WHERE name = 'Air Freshener';
UPDATE product SET min_stock = 10 WHERE name = 'First Aid Kit';