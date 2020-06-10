const ShoppingListService = require('../src/shopping-list-service.js')
const knex = require('knex')

describe(`Shopping list service object`, function () {
     let db
     let testList = [
          {
               id: 1,
               name: 'Fish',
               price: 5.00,
               category: 'Main',
               date_added: new Date('2100-05-22T16:28:32.615Z')
          },
          {
               id: 2,
               name: 'Chicken',
               price: 4.00,
               category: 'Lunch',
               date_added: new Date('2100-05-22T16:28:32.615Z')
          },
          {
               id: 3,
               name: 'Cheetos',
               price: 2.00,
               category: 'Snack',
               date_added: new Date('2100-05-22T16:28:32.615Z')
          },
          {
               id: 4,
               name: 'Bacon',
               price: 9.00,
               category: 'Breakfast',
               date_added: new Date('2100-05-22T16:28:32.615Z')
          },
     ];

     before(() => {
          db = knex({
               client: 'pg',
               connection: process.env.TEST_DB_URL,
          });
     });

     before(() => db('shopping_list').truncate());

     afterEach(() => db('shopping_list').truncate());

     after(() => db.destroy());

     context(`Given 'shopping_list' has data`, () => {
          beforeEach(() => {
               return db
                    .into('shopping_list')
                    .insert(testList);
          });

          it(`getAllListItems() resolves all listItems from 'shopping_list' table`, () => {
               const expectedItems = testList.map(listItem => ({
                    ...listItem,
                    checked: false,
                    date_added: new Date(listItem.date_added)
               }));
               // test that ShoppingListService.getShoppingList gets data from table
               return ShoppingListService.getAllListItems(db)
                    .then(actual => {
                         expect(actual).to.eql(expectedItems)
                    });
          });

          it(`getById() resolves an listItem by id from 'shopping_list' table`, () => {
               const thirdId = 3
               const thirdTestlistItem = testList[thirdId - 1]
               return ShoppingListService.getById(db, thirdId)
                    .then(actual => {
                         expect(actual).to.eql({
                              id: thirdId,
                              name: thirdTestlistItem.name,
                              price: thirdTestlistItem.price,
                              category: thirdTestlistItem.category,
                              checked: false,
                              date_added: thirdTestlistItem.date_added,
                         });
                    });
          });
          it(`deleteItem() removes an listItem by id from 'shopping_list' table`, () => {
               const itemIdToDelete = 3
               return ShoppingListService.deleteItem(db, itemIdToDelete)
                    .then(() => ShoppingListService.getAllListItems(db))
                    .then(allListItems => {
                         // copy the test listItems array without the "deleted" listItem
                         const expected = testList
                              .filter(listItem => listItem.id !== itemIdToDelete)
                              .map(listItem => ({
                                   ...listItem,
                                   checked: false,
                              }));
                         expect(allListItems).to.eql(expected)
                    })
          })
          it(`updateItem() updates an listItem from the 'shopping_list' table`, () => {
               const idOflistItemToUpdate = 3
               const newListItemData = {
                    name: 'updated title',
                    price: 10.00,
                    checked: true,
                    date_added: new Date(),
               };
               const originalItem = testList[idOflistItemToUpdate - 1];
               return ShoppingListService.updateItem(db, idOflistItemToUpdate, newListItemData)
                    .then(() => ShoppingListService.getById(db, idOflistItemToUpdate))
                    .then(listItem => {
                         expect(listItem).to.eql({
                              id: idOflistItemToUpdate,
                              ...originalItem,
                              ...newListItemData,
                         });
                    });
          });
     });

     context(`Given 'shopping_list' has no data`, () => {
          it(`getAllListItems() resolves an empty array`, () => {
               return ShoppingListService.getAllListItems(db)
                    .then(actual => {
                         expect(actual).to.eql([])
                    });
          });

          it(`insertItem() inserts a new listItem and resolves the new listItem with an 'id'`, () => {
               const newListItem = {
                    name: 'Test new name',
                    checked: true,
                    price: 10.00,
                    category: 'Snack',
                    date_added: new Date('2020-01-01T00:00:00.000Z'),
               }
               return ShoppingListService.insertItem(db, newListItem)
                    .then(actual => {
                         expect(actual).to.eql({
                              id: 1,
                              name: newListItem.name,
                              price: newListItem.price,
                              category: newListItem.category,
                              checked: newListItem.checked,
                              date_added: new Date(newListItem.date_added),
                         });
                    });
          });
     });
});