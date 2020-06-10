const ShoppingListService = {
     getAllListItems(knex) {
          return knex.select('*')
               .from('shopping_list')
     },
     insertListItem(knex, newListItem) {
          return knex
               .insert(newListItem)
               .into('shopping_list')
               .returning('*')
               .then(rows => {
                    return rows[0]
               })
     },
     getById(knex, id) {
          return knex.from('shopping_list')
               .select('*')
               .where('id', id)
               .first()
     },
     deleteListItem(knex, id) {
          return knex('shopping_list')
               .where({ id })
               .delete()
     },
     updateListItem(knex, id, newListItemData) {
          return knex('shopping_list')
               .where({ id })
               .update(newListItemData)
     },
};

module.exports = ShoppingListService;