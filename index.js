'use strict';

const { Database } = require('sqlite3').verbose()
const Table = require('cli-table')

const db = new Database('db/Chinook_Sqlite.sqlite')

// db.serialize(() => {
// 	// db.all(`
// 	// 	SELECT Customer.FirstName || " " || Customer.LastName AS "Name", 
// 	// 	       Customer.CustomerId,
// 	// 	       Customer.Country 
// 	// 	FROM   Customer
// 	// 	WHERE  Customer.Country != "USA"
// 	// `, (err, customers) => {
// 	// 	console.log(customers)
// 	// })

// 	// db.all(`
// 	// 	SELECT Customer.FirstName || " " || Customer.LastName AS "Name", 
// 	// 	       Customer.CustomerId,
// 	// 	       Customer.Country 
// 	// 	FROM   Customer
// 	// 	WHERE  Customer.Country = "Brazil"
// 	// `, (err, customers) => {
// 	// 	customers.forEach((customer) => {
// 	// 		console.log(`${customer.CustomerId}: ${customer.Name} (${customer.Country})`)
// 	// 	})
// 	// })

// 	// db.each(`
// 	// 	SELECT Customer.FirstName || " " || Customer.LastName AS "Name", 
// 	// 	       Customer.CustomerId,
// 	// 	       Customer.Country 
// 	// 	FROM   Customer
// 	// 	WHERE  Customer.Country = "Brazil"
// 	// `, (err, {CustomerId, Name, Country}) => {
// 	// 	console.log(`${CustomerId}: ${Name} (${Country})`)
// 	// })

// 	// db.each(`
// 	// 	SELECT Customer.FirstName || " " || Customer.LastName as "Name",
// 	// 	       Invoice.InvoiceId,
// 	// 	       Invoice.InvoiceDate, 
// 	// 	       Invoice.BillingCountry from Customer
// 	// 	JOIN   Invoice on Customer.CustomerId = Invoice.CustomerId
// 	// 	WHERE  Customer.Country = "Brazil"
// 	// `, (err, {InvoiceId, Name, InvoiceDate, BillingCountry}) => {
// 	// 	console.log(`${InvoiceId}: ${Name}, ${InvoiceDate} (${BillingCountry})`)
// 	// })

// 	// const table = new Table({
//  //    head: ['Invoice Id', 'Name', 'Invoice Date', 'Billing Country'], 
//  //    colWidths: [30, 30, 30, 30],
//  //    style: {compact: true}
// 	// });

// 	// db.each(`
// 	// 	SELECT Customer.FirstName || " " || Customer.LastName as "Name",
// 	// 	       Invoice.InvoiceId,
// 	// 	       Invoice.InvoiceDate, 
// 	// 	       Invoice.BillingCountry from Customer
// 	// 	JOIN   Invoice on Customer.CustomerId = Invoice.CustomerId
// 	// 	WHERE  Customer.Country = "Brazil"
// 	// `, (err, { Name, InvoiceId, InvoiceDate, BillingCountry }) => {
// 	// 	table.push(
// 	// 		[`${InvoiceId}`, `${Name}`, `${InvoiceDate}`, `${BillingCountry}`]
// 	// 	)
// 	// }, () => {
// 	// 	console.log(table.toString());
// 	// })

// 	// const table2 = new Table({
// 	// 	head: ['Name'], 
//  //    colWidths: [16],
//  //    style: {compact: true}
// 	// })

// 	// db.each(`
// 	// 	Select Employee.FirstName || " " || Employee.LastName as "Name" 
// 	// 	FROM   Employee
// 	// 	WHERE  Employee.Title = 'Sales Support Agent'
// 	// `, (err, { Name }) => table2.push([`${Name}`]),
// 	// 	() => console.log(table2.toString())
// 	// )

// })

// db.close()

// const knex = require('knex')({
// 	client: 'sqlite3',
// 	connection: {
// 		filename: 'db/Chinook_Sqlite.sqlite'
// 	},
// 	useNullAsDefault: false
// })

const knex = require('knex')({
	client: 'pg',
	connection: 'postgres://localhost:5432/chinook',
})

knex
	('Invoice')
	.distinct('BillingCountry')
	.orderBy('BillingCountry')
	.then((country) => {
		console.log('5. Provide a query showing a unique list of billing countries from the Invoice table')
		console.log(country)
	})

knex
	('Invoice')
	.where('BillingCountry', 'Canada')
	.then((data) => {
		console.log('6. Provide a query showing the invoices of customers who are from Brazil.')
		console.log(data)
	})

knex('Invoice')
	.select('Invoice.*')
	.select(knex.raw(`"Employee"."FirstName" || ' ' || "Employee"."LastName" as sales_agent`))
	.join('Customer', 'Invoice.CustomerId', 'Customer.CustomerId')
	.join('Employee', 'Customer.SupportRepId', 'Employee.EmployeeId')
	.then((data) => {
		console.log(`7. Provide a query that shows the invoices associated with each sales agent. The resultant table should include the Sales Agent's full name.`)
		console.log(data)
	})

knex('Invoice')
	.select(knex.raw(`"Customer"."FirstName" || ' ' || "Customer"."LastName" as customer_name`))
	.select(knex.raw(`"Employee"."FirstName" || ' ' || "Employee"."LastName" as employee_name`))
	.sum('Invoice.Total as total_purchases')
	.join('Customer', 'Invoice.CustomerId', 'Customer.CustomerId')
	.join('Employee', 'Customer.SupportRepId', 'Employee.EmployeeId')
	.groupBy('Customer.CustomerId', 'Employee.EmployeeId')
	.orderBy('total_purchases', 'desc')
	.then((data) => {
		console.log('8. Provide a query that shows the Invoice Total, Customer name, Country and Sale Agent name for all invoices and customers.')
		console.log(data)
	})



knex.destroy()
