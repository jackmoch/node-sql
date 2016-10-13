'use strict';

const { Database } = require('sqlite3').verbose()
const Table = require('cli-table')

const db = new Database('db/Chinook_Sqlite.sqlite')

db.serialize(() => {
	// db.all(`
	// 	SELECT Customer.FirstName || " " || Customer.LastName AS "Name", 
	// 	       Customer.CustomerId,
	// 	       Customer.Country 
	// 	FROM   Customer
	// 	WHERE  Customer.Country != "USA"
	// `, (err, customers) => {
	// 	console.log(customers)
	// })

	// db.all(`
	// 	SELECT Customer.FirstName || " " || Customer.LastName AS "Name", 
	// 	       Customer.CustomerId,
	// 	       Customer.Country 
	// 	FROM   Customer
	// 	WHERE  Customer.Country = "Brazil"
	// `, (err, customers) => {
	// 	customers.forEach((customer) => {
	// 		console.log(`${customer.CustomerId}: ${customer.Name} (${customer.Country})`)
	// 	})
	// })

	// db.each(`
	// 	SELECT Customer.FirstName || " " || Customer.LastName AS "Name", 
	// 	       Customer.CustomerId,
	// 	       Customer.Country 
	// 	FROM   Customer
	// 	WHERE  Customer.Country = "Brazil"
	// `, (err, {CustomerId, Name, Country}) => {
	// 	console.log(`${CustomerId}: ${Name} (${Country})`)
	// })

	// db.each(`
	// 	SELECT Customer.FirstName || " " || Customer.LastName as "Name",
	// 	       Invoice.InvoiceId,
	// 	       Invoice.InvoiceDate, 
	// 	       Invoice.BillingCountry from Customer
	// 	JOIN   Invoice on Customer.CustomerId = Invoice.CustomerId
	// 	WHERE  Customer.Country = "Brazil"
	// `, (err, {InvoiceId, Name, InvoiceDate, BillingCountry}) => {
	// 	console.log(`${InvoiceId}: ${Name}, ${InvoiceDate} (${BillingCountry})`)
	// })

	const table = new Table({
    head: ['Invoice Id', 'Name', 'Invoice Date', 'Billing Country'], 
    colWidths: [30, 30, 30, 30],
    style: {compact: true}
	});

	db.each(`
		SELECT Customer.FirstName || " " || Customer.LastName as "Name",
		       Invoice.InvoiceId,
		       Invoice.InvoiceDate, 
		       Invoice.BillingCountry from Customer
		JOIN   Invoice on Customer.CustomerId = Invoice.CustomerId
		WHERE  Customer.Country = "Brazil"
	`, (err, { Name, InvoiceId, InvoiceDate, BillingCountry }) => {
		table.push(
			[`${InvoiceId}`, `${Name}`, `${InvoiceDate}`, `${BillingCountry}`]
		)
	}, () => {
		console.log(table.toString());
	})

	const table2 = new Table({
		head: ['Name'], 
    colWidths: [16],
    style: {compact: true}
	})

	db.each(`
		Select Employee.FirstName || " " || Employee.LastName as "Name" 
		FROM   Employee
		WHERE  Employee.Title = 'Sales Support Agent'
	`, (err, { Name }) => table2.push([`${Name}`]),
		() => console.log(table2.toString())
	)

})

db.close()