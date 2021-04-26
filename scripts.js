(function (window, document) {
  'use strict';

  function app() {
    const form = new DOM('form');
    let table = [...new DOM('table').element][0];
    const header = new DOM('header').element[0];
    const imgValue = [...new DOM('#img').element][0];
    const brandValue = [...new DOM('#brand').element][0];
    const yearValue = [...new DOM('#year').element][0];
    const colorValue = [...new DOM('#color').element][0];
    const licensePlateValue = [...new DOM('#license-plate').element][0];
    const ajax = new XMLHttpRequest();
    const infos = [
      imgValue,
      brandValue,
      yearValue,
      colorValue,
      licensePlateValue,
    ];
    let tableId = 0;

    form.on('submit', isFormComplete);

    ajax.open('GET', 'company.json');
    ajax.send();
    ajax.addEventListener('readystatechange', isRequestOk);

    function isRequestOk() {
      if (ajax.readyState === 4 && ajax.status === 200) {
        handleCompanyInfos();
      }
    }
    function handleCompanyInfos() {
      const response = JSON.parse(ajax.responseText);
      const companyName = document.createElement('h1');
      const contact = document.createElement('h2');
      contact.className = 'phone';
      companyName.className = 'company-name';
      companyName.innerHTML = response['name'];
      contact.innerHTML = `Telefone para contato: ${response['phone']}`;
      header.appendChild(companyName);
      header.appendChild(contact);
    }

    function isFormComplete(event) {
      event.preventDefault();
      let formComplete = true;
      infos.forEach((element) => {
        element.value === '' ? (formComplete = false) : null;
      });
      if (formComplete) {
        handleSubmitForm();
      } else {
        window.alert('Por favor, preencha todos os campos.');
      }
    }

    function handleSubmitForm() {
      let node = document.createElement('tr');
      let newButton = document.createElement('button');

      node.id = tableId;
      newButton.innerHTML = 'Deletar';
      newButton.className = 'delete-button';
      newButton.id = tableId;
      newButton.addEventListener('click', deleteCar);
      infos.forEach((element, index) => {
        let newElement = document.createElement('td');
        let newElementImg = document.createElement('img');
        if (index === 0) {
          newElementImg.src = element.value;
          newElementImg.className = 'table-content';
          node.appendChild(newElementImg);
        } else {
          newElement.innerHTML = element.value;
          newElement.className = 'table-content';
          node.appendChild(newElement);
        }
      });
      node.appendChild(newButton);
      table.appendChild(node);
      tableId += 1;
      clearValues();
    }

    function clearValues() {
      infos.forEach((element) => {
        element.value = null;
      });
    }

    function deleteCar(event) {
      let elementRemoved = document.querySelector(
        `tr[id = "${event.target.id}"]`
      );
      table.removeChild(elementRemoved);
    }
  }
  app();
})(window, document);
