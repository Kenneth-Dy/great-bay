const { createConnection } = require('mysql2')
const inquirer = require('inquirer')
require('console.table')

const db = createConnection('mysql://root:rootroot@localhost/great_bay_db')

const mainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select action:',
      choices: ['Post an item','Bid on an item', 'Exit']
    }
  ])
    .then(({ action }) => {
  if (action === 'Post an item') {
    postItem()
  }else if (action === 'Bid on an item') {
    bidItem()
  }else if (action === 'Exit'){
    process.exit()
  }
    })
    .catch(err => console.log(err))
}

const postItem = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What are you selling?'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Describe your product/service:'
    },
    {
      type: 'number',
      name: 'price',
      message: 'What is your starting bid?'
    }
  ])
    .then( res => {
      db.query('INSERT INTO items SET ?', res, err => {
        if(err) {console.log(err)}
        console.log('Item posted!')
        mainMenu()
      })
    })
    .catch(err => console.log(err))
}

const bidItem = () => {
  db.query('SELECT * FROM items', (err, items) => {
    console.table(items)
    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Choose which item to bid on:',
        choices: items.map(item => item.name)
      },
      {
        type: 'number',
        name: 'price',
        message: 'How much do you want to bid on the item?'
      }
    ])
      .then( ({name, price}) => {
        let item = items.filter(data => data.name === name)
        // console.log(item)
        // item.price
        // console.log(items)
        if(price > item[0].price) {
          db.query('UPDATE items SET ? WHERE ?',[{price}, {name}], err =>{
            if(err) {console.log(err)}
            console.log('Bid accepted!')
            mainMenu()
          })
        }else {
          console.log('Bid not high enough.')
          bidItem()
        }
      })
      .catch(err => console.log(err))
  })

}

mainMenu()