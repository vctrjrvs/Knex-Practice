require('dotenv').config()
const knex = require('knex')


const knexInstance = knex({
     client: 'pg',
     connection: process.env.DB_URL
})

const searchTerm = 'burger'

function getTextItems(searchTerm) {
     knexInstance
          .select('name', 'price', 'category', 'checked', 'date_added')
          .from('shopping_list')
          .where('name', 'ILIKE', `%${searchTerm}%`)
          .then(result => {
               console.log(result)
          })
}

getTextItems(searchTerm)

function paginateProducts(pageNumber) {
     const productsPerPage = 6
     const offset = productsPerPage * (pageNumber - 1)
     knexInstance
          .select('name', 'price', 'category', 'checked', 'date_added')
          .from('shopping_list')
          .limit(productsPerPage)
          .offset(offset)
          .then(result => {
               console.log(result)
          })
}

paginateProducts(2);

const daysAgo = 5;

function getItemsAddedAfterDate(daysAgo) {
     knexInstance
          .select('id', 'name', 'price', 'category', 'checked', 'date_added')
          .from('shopping_list')
          .where('date_added',
               '>',
               knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
          .then(result => {
               console.log(result)
          })
}

getItemsAddedAfterDate(daysAgo)

function getTotalPerCategory() {
     knexInstance
          .select('category')
          .from('shopping_list')
          .groupBy('category')
          .sum('price as total')
          .then(result => {
               console.log(result)
          })
}

getTotalPerCategory()