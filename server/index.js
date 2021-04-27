const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const cars = [
  {
    img:
      'https://i0.wp.com/thegarage.com.br/wp-content/uploads/2020/09/1969-volkswagen-fusca-original.jpg?fit=1500%2C1000&ssl=1',
    brand: 'Volkswagen Fusca',
    year: '1952',
    licensePlate: 'AAA-1234',
    color: 'Verde',
  },
  {
    img:
      'https://www.doutorie.com.br/blog/wp-content/uploads/2016/08/dica-324.jpg',
    brand: 'Fiat Palio',
    year: '2012',
    licensePlate: 'BBBB-4567',
    color: 'Prata',
  },
];

app.get('/cars', function (req, res) {
  res.send(cars);
});

app.post('/cars', function (req, res) {
  const newCar = req.body;
  cars.push(newCar);
});

app.delete('/cars/:plate', function (req, res) {
  const { plate } = req.params;
  const carIndex = cars.findIndex((car) => car.licensePlate === plate);
  cars.splice(carIndex, 1);
  return res.status(204);
});

app.listen(port);
