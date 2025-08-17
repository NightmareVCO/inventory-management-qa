ALTER TABLE product
ADD COLUMN older_quantity INTEGER DEFAULT 0 NOT NULL;

UPDATE product SET older_quantity = 10 WHERE name = 'Laptop Pro';
UPDATE product SET older_quantity = 5 WHERE name = 'Office Desk';
UPDATE product SET older_quantity = 20 WHERE name = 'Running Shoes';
UPDATE product SET older_quantity = 100 WHERE name = 'Organic Apples';
UPDATE product SET older_quantity = 40 WHERE name = 'Teddy Bear';
UPDATE product SET older_quantity = 30 WHERE name = 'Fantasy Novel';
UPDATE product SET older_quantity = 25 WHERE name = 'Soccer Ball';
UPDATE product SET older_quantity = 50 WHERE name = 'Shampoo';
UPDATE product SET older_quantity = 35 WHERE name = 'Car Charger';
UPDATE product SET older_quantity = 60 WHERE name = 'Vitamin C';

UPDATE product SET older_quantity = 15 WHERE name = 'Bluetooth Headphones';
UPDATE product SET older_quantity = 2 WHERE name = 'Dining Table';
UPDATE product SET older_quantity = 12 WHERE name = 'Winter Jacket';
UPDATE product SET older_quantity = 80 WHERE name = 'Milk';
UPDATE product SET older_quantity = 18 WHERE name = 'RC Car';
UPDATE product SET older_quantity = 22 WHERE name = 'Science Textbook';
UPDATE product SET older_quantity = 35 WHERE name = 'Yoga Mat';
UPDATE product SET older_quantity = 25 WHERE name = 'Face Cream';
UPDATE product SET older_quantity = 30 WHERE name = 'Wiper Blades';
UPDATE product SET older_quantity = 100 WHERE name = 'Pain Reliever';

UPDATE product SET older_quantity = 8 WHERE name = 'Smartphone';
UPDATE product SET older_quantity = 6 WHERE name = 'Bookshelf';
UPDATE product SET older_quantity = 18 WHERE name = 'Jeans';
UPDATE product SET older_quantity = 70 WHERE name = 'Bread';
UPDATE product SET older_quantity = 20 WHERE name = 'Lego Set';
UPDATE product SET older_quantity = 28 WHERE name = 'Mystery Novel';
UPDATE product SET older_quantity = 10 WHERE name = 'Tennis Racket';
UPDATE product SET older_quantity = 40 WHERE name = 'Lipstick';
UPDATE product SET older_quantity = 45 WHERE name = 'Air Freshener';
UPDATE product SET older_quantity = 15 WHERE name = 'First Aid Kit';