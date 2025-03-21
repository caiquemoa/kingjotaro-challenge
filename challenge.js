const fs = require('fs')

const file = JSON.parse(fs.readFileSync('data.json', 'utf8'))

const data = file.map((item) => {
  let newItem = item
  newItem.newTittle = item.title
    .toLowerCase()
    .replace(/(\d+)\s*([kgl]|quilo|litro)/g, '$1$2')
    .replace(/(tipo)\s*(\d+)/g, '$1$2')
    .replace(/(tipo\s*\d+|tipo\s+| de | do | da | sem | zero )/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-+/g, ' ')
    .replace(/(\d+)\s*(kg|quilos|quilo|gramas|g)/gi, (match, num, unit) => {
      if (unit === 'g' || unit === 'gramas') {
        return parseInt(num, 10) / 1000 + 'KG'
      } else {
        return num + 'KG'
      }
    })
    .replace(/(\d+)\s*(litro|litros|l|lt|ml)/gi, (match, num, unit) => {
      if (unit === 'ml') {
        return parseInt(num, 10) / 1000 + 'L'
      } else {
        return num + 'L'
      }
    })
    .split(/\s+/)
    .sort()
    .join(' ')

  return newItem
})

const match = {}
data.forEach((item) => {
  const key = item.newTittle
  if (!match[key]) {
    match[key] = {
      products: [],
      category: item.title,
    }
  }

  match[key].products.push({
    title: item.title,
    supermarket: item.supermarket,
    price: item.price,
  })
})

const result = Object.keys(match).map((key) => ({
  category: match[key].category,
  count: match[key].products.length,
  products: match[key].products,
}))

fs.writeFile('output.json', JSON.stringify(result, null, 2), (err) => {
  if (err) {
    console.error('Erro ao salvar o arquivo:', err)
    return
  }
  console.log('Arquivo output.json salvo com sucesso!')
})
