(function (window, document) {
  function app() {
    const form = new DOM('form');
    let table = [...new DOM('table').element][0];
    const header = new DOM('header').element[0];
    const ajaxCompany = new XMLHttpRequest();
    const ajaxCars = new XMLHttpRequest();

    let tableId = 0;

    form.on('submit', handleSubmitForm);

    ajaxCompany.open('GET', 'company.json');
    ajaxCompany.send();
    ajaxCompany.addEventListener('readystatechange', isCompanyRequestOk);

    function isCompanyRequestOk() {
      if (ajaxCompany.readyState === 4 && ajaxCompany.status === 200) {
        handleCompanyInfos();
      }
    }
    function handleCompanyInfos() {
      const response = JSON.parse(ajaxCompany.responseText);
      header.innerHTML = `<h1 class="company-name">${response['name']}</h1><h2 class="phone">Telefone para contato: ${response['phone']}</h2>`;
    }

    function getCarsInfos() {
      ajaxCars.open('GET', 'http://localhost:3000/cars');
      ajaxCars.send();
      ajaxCars.addEventListener('readystatechange', isCarsRequestOk);
    }

    function isCarsRequestOk() {
      if (ajaxCars.readyState === 4 && ajaxCars.status === 200) {
        const responseCars = JSON.parse(ajaxCars.responseText);
        getTable(responseCars);
      }
    }

    function getTable(newCar) {
      const getTableDataCell = (element, index) =>
        index
          ? `<td>${element}</td>`
          : `<td><img src="${element}" alt="car-image"></td>`;
      const newCarHtml = newCar.map((car) => {
        tableId += 1;
        return `<tr id=${tableId}>
            ${Object.values(car)
              .map((element, index) => getTableDataCell(element, index))
              .join('')}
            <td> <button id=${tableId} class="delete-button">Deletar</button> </td>
          </tr>`;
      });

      table.innerHTML = `
        <tr>
          <th>Fotos</th>
          <th>Marca e Modelo</th>
          <th>Ano</th>
          <th>Placa</th>
          <th>Cor</th>
          <th></th>
        </tr>${newCarHtml.join('')}`;

      const deleteButtons = document.querySelectorAll(
        '[class="delete-button"]'
      );
      deleteButtons.forEach((button) => {
        button.addEventListener('click', deleteCar);
      });
    }

    function handleSubmitForm(event) {
      event.preventDefault();
      const newCar = {};
      [...form.element[0]].forEach((element, index) => {
        if (index < 5) {
          newCar[element.id] = element.value;
        }
      });
      ajaxCars.open('POST', 'http://localhost:3000/cars');
      ajaxCars.setRequestHeader('Content-Type', 'application/json');
      ajaxCars.send(JSON.stringify(newCar));
      ajaxCars.onreadystatechange = getCarsInfos;
    }

    function deleteCar(event) {
      const table = document.querySelector('tbody');
      let elementRemoved = document.querySelector(
        `tr[id = "${event.target.id}"]`
      );
      table.removeChild(elementRemoved);

      const licensePlate = [...elementRemoved.children][3].innerHTML;

      ajaxCars.open('DELETE', `http://localhost:3000/cars/${licensePlate}`);
      ajaxCars.send(licensePlate);
    }
    getCarsInfos();
  }
  app();
})(window, document);
