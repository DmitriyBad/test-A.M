-- create table users
  create TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
  );

-- create table categories
  CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
	  name VARCHAR(100) NOT NULL,
	  name_en VARCHAR(100) NOT NULL,
	  name_ru VARCHAR(100) NOT NULL,
	  parent_id INT
   );
  
-- create type
	create type products_state as enum ('під замовлення', 'в наявності', 'немає в наявності');

-- create table products
  CREATE TABLE products (
    id SERIAL PRIMARY KEY,
		barcode VARCHAR(13),
    name VARCHAR(100) NOT NULL,
	  description VARCHAR(250) NOT NULL,
	  name_en VARCHAR(100) NOT NULL,
	  description_en VARCHAR(250) NOT NULL,
	  name_ru VARCHAR(100) NOT NULL,
	  description_ru VARCHAR(250) NOT NULL,
    status products_state,
    price NUMERIC(15,2) NULL,
	  discount NUMERIC(15,2) NULL,	  
	  hidden boolean     
	);
	
	
-- create table category_product
  CREATE TABLE category_product (
		id SERIAL PRIMARY KEY,
	  category_id integer, 
    product_id integer,
		FOREIGN KEY (category_id)  REFERENCES categories (id), 
		FOREIGN KEY (product_id)  REFERENCES products (id)	  	
	);
	
