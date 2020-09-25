-- Multi-Table Query Practice

-- Display the ProductName and CategoryName for all products in the database. Shows 77 records.

SELECT p.ProductName,
       c.CategoryName
  FROM Product AS p
       JOIN
       Category AS c ON p.CategoryId = c.Id

-- Display the order Id and shipper CompanyName for all orders placed before August 9 2012. Shows 429 records.

SELECT o.id,
       s.CompanyName,
       o.OrderDate
  FROM [Order] AS o
       JOIN
       Shipper AS s ON o.ShipVia = s.Id
 WHERE DATE(o.OrderDate) < DATE('2012-08-09') 
 ORDER BY o.OrderDate

-- Display the name and quantity of the products ordered in order with Id 10251. Sort by ProductName. Shows 3 records.

SELECT p.ProductName,
       o.quantity
  FROM OrderDetail AS o
       JOIN
       Product AS p ON o.ProductId = p.Id
 WHERE o.OrderID = 10251
 ORDER BY p.ProductName

-- Display the OrderID, Customer's Company Name and the employee's LastName for every order. All columns should be labeled clearly. Displays 16,789 records.

SELECT o.Id AS [Order Id],
       c.CompanyName AS [Customer Company Name],
       e.LastName AS [Employee''s Last Name]
  FROM [Order] AS o
       JOIN
       Customer AS c ON o.CustomerId = c.Id
       JOIN
       Employee AS e ON o.EmployeeId = e.Id;

-- Displays CategoryName and a new column called Count that shows how many products are in each category. Shows 8 records.

SELECT c.CategoryName, 
       count(p.ProductName) AS [Count]
  FROM Products AS p
       JOIN
       Categories AS c ON p.CategoryID = c.CategoryID
  GROUP BY c.CategoryName

-- Display OrderID and a column called ItemCount that shows the total number of products placed on the order. Shows 196 records.

SELECT OrderID, 
       COUNT(ProductID) AS ItemCount
  FROM OrderDetails AS o
  GROUP BY OrderID