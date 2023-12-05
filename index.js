//import * as EntityService from './Services/Table/EntityService.js';
//const { TableService } = require('./Services/Table/TableService.js');
const TableService = require('./Services/Table/TableService.js');
const EntityService = require('./Services/Table/EntityService.js');
const ContainerService = require('./Services/Blob/ContainerService.js');
const BlobService = require('./Services/Blob/BlobService.js');
const QueueService = require('./Services/Queue/QueueService.js');

const express = require('express');

const app = express();
const port = 3000;

TableService.create("Categories");
TableService.create("Goods");
ContainerService.create("goods");
QueueService.create("img-convert");
QueueService.convertQueueMonitor("img-convert");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <form action="/category" method="post">
      <label for="name">Введите название категории:</label><br>
      <input type="text" id="name1" name="category" required><br>
      <label for="name">Введите название родительской категории (если нету то оставьте пустым):</label><br>
      <input type="text" id="name2" name="parentCategory"><br>
      <input type="radio" id="create" name="mode" value="create">
      <label for="male">Создать (по умолчанию)</label><br>
      <input type="radio" id="delete" name="mode" value="delete">
      <label for="female">Удалить</label><br>
      <button type="submit">Создать категорию</button>
    </form>
    <br>
    <br>
    <br>
    <br>
    <form action="/goods" method="post">
    <label for="name">Введите название товара:</label><br>
    <input type="text" id="name1" name="name" required><br>
    <label for="name">Введите название категории:</label><br>
    <input type="text" id="name2" name="category" required><br>
    <label for="name">Введите цену товара:</label><br>
    <input type="text" id="name3" name="price" required><br>
    <label for="name">Фото товара:</label><br>
    <input type="file" id="name4" name="image" accept=".png, .jpg, .jpeg" required><br>
    <input type="radio" id="create" name="mode" value="create">
    <label for="male">Создать (по умолчанию)</label><br>
    <input type="radio" id="update" name="mode" value="update">
    <label for="female">Изменить</label><br>
    <input type="radio" id="delete" name="mode" value="delete">
    <label for="female">Удалить</label><br>
    <button type="submit">Создать категорию</button>
  </form>
  `);
});
app.post('/goods', (req, res) => {
  let { name, category, price, image, mode } = req.body;
  if (mode == undefined) {
    mode == "create"
  }
  if (mode == "create") {
    if (image != undefined) {
      BlobService.upload(image,`./images/${image}`,"goods")
      .then((imageURL) => {
        QueueService.send("img-convert", {image: image, imageTS: imageURL});
        EntityService.create("Goods", category, name, { price: price, imageURL: imageURL, thumbnailURL: `thumbnail-${imageURL}` }, true);
      });
    }
  } else if (mode == "update") {
    //Supported only update price
    EntityService.update("Goods", category, name, {price: price}, true);
  } else {
    EntityService.dell("Goods", category, name);
  }
  res.send("Sucess!")
});
app.post('/category', (req, res) => {
  let { category, parentCategory, mode } = req.body;
  if (mode != "delete") {
    if (parentCategory == "") {
      parentCategory = "default";
    }
    else {
      EntityService.getAll("Categories")
      .then((allCategories) => {
        let isParent = false;
        for (item in allCategories) {
          if (item.rowKey == parentCategory) {
            isParent = true;
            break;
          }
        }
        if (!isParent) {
          console.log(`No parent category named ${parentCategory}, set default parentCategory`)
          parentCategory = "default";
        }
      })
    }
    EntityService.create("Categories",parentCategory,category);
    res.send("New category created!")
  } else {
    if (parentCategory == "") {
      parentCategory = "default";
    }
    EntityService.dell("Categories", parentCategory, category);
    res.send("Element deleted!")
  }
});

app.get('/store', (req, res) => {
  let html = `<ul>`

  EntityService.getAll("Categories")
  .then((elem) => {
    for (item in elem) {
      html += `<li><a href="http://localhost:3000/store/${elem[item].rowKey}" >${elem[item].rowKey}</a></li>`;
    }
    html += `</ul>`;
    res.send(html)
  })
});

app.get('/store/:category', (req, res) => {
  const category = req.params["category"];
  EntityService.getAll("Goods")
  .then((elem) => {
    let html = ``;
    for (item in elem) {
      if (elem[item].partitionKey == category) {
        html += `<h1>Name: ${elem[item].rowKey}</h1><p>Price: ${elem[item].price}</p>`;
      }
    }
    res.send(html);
  })
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
