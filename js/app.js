/* eslint-disable no-console */
'use strict';

let DB;

//Interface selectors
const form = document.querySelector('form'),
  petName = document.querySelector('#mascota'),
  clientName = document.querySelector('#cliente'),
  phone = document.querySelector('#telefono'),
  date = document.querySelector('#fecha'),
  hour = document.querySelector('#hora'),
  symptoms = document.querySelector('#sintomas'),
  appointments = document.querySelector('#citas'),
  adminHeading = document.querySelector('#administra');

//Wait for DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  //create data base (2 parameters name of data base and version of data base)
  let createDB = window.indexedDB.open('citas', 1);

  //if there is error send to console
  createDB.onerror = function () {
    console.log('Hubo un error');
  };
  //if it's ok show in console and asign to data base
  createDB.onsuccess = function () {
    //asign to data base
    DB = createDB.result;

    showAppointments();
  };

  //create schema, it only runs once
  createDB.onupgradeneeded = function (e) {
    //event is the data base
    let db = e.target.result;

    //defines objectstore. 2 parameters, name of the data base and options. KeyPath its the index of the data base
    let objectStore = db.createObjectStore('citas', {
      keyPath: 'key',
      autoIncrement: true,
    });

    //create index and fields of the data base. 3 parameters, name, keypath and options
    objectStore.createIndex('mascota', 'mascota', { unique: false });
    objectStore.createIndex('cliente', 'cliente', { unique: false });
    objectStore.createIndex('telefono', 'telefono', { unique: false });
    objectStore.createIndex('fecha', 'fecha', { unique: false });
    objectStore.createIndex('hora', 'hora', { unique: false });
    objectStore.createIndex('sintomas', 'sintomas', { unique: false });
  };

  //when form is submited call addData to add data in database
  form.addEventListener('submit', addData);

  function addData(e) {
    e.preventDefault();

    //object saved in data base with all info from the appointment
    const newAppointment = {
      mascota: petName.value,
      cliente: clientName.value,
      telefono: phone.value,
      fecha: date.value,
      hora: hour.value,
      sintomas: symptoms.value,
    };

    //use transactions in indexedDB
    let transaction = DB.transaction(['citas'], 'readwrite');
    let objectStore = transaction.objectStore('citas');
    let request = objectStore.add(newAppointment);

    request.onsuccess = () => {
      form.reset();
    };
    transaction.oncomplete = () => {
      console.log('Cita agregada');
      showAppointments();
    };
    transaction.onerror = () => {
      console.log('Hubo un error');
    };
  }

  function showAppointments() {
    //clean previous appointments
    while (appointments.firstChild) {
      appointments.removeChild(appointments.firstChild);
    }

    //create objectStore
    let objectStore = DB.transaction('citas').objectStore('citas');
    //return a request
    objectStore.openCursor().onsuccess = function (e) {
      //cursor is positioned in the indicated record to acces the data
      let cursor = e.target.result;
      if (cursor) {
        let appointmentHTML = document.createElement('li');
        appointmentHTML.setAttribute('data-cita-id', cursor.value.key);
        appointmentHTML.classList.add('list-group-item');

        appointmentHTML.innerHTML = `
            <p class="font-weight-bold">Mascota: <span class="font-weight-normal">${cursor.value.mascota}</span></p>
            <p class="font-weight-bold">Cliente: <span class="font-weight-normal">${cursor.value.cliente}</span></p>
            <p class="font-weight-bold">Teléfono: <span class="font-weight-normal">${cursor.value.telefono}</span></p>
            <p class="font-weight-bold">Fecha: <span class="font-weight-normal">${cursor.value.fecha}</span></p>
            <p class="font-weight-bold">Hora: <span class="font-weight-normal">${cursor.value.hora}</span></p> 
            <p class="font-weight-bold">Síntomas: <span class="font-weight-normal">${cursor.value.sintomas}</span></p>
        `;
        //create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('borrar', 'btn', 'btn-danger');
        deleteBtn.innerHTML = '<span aria-hidden="true"></span>Borrar';
        deleteBtn.onclick = deleteAppointment;
        appointmentHTML.appendChild(deleteBtn);

        //append in the parent element
        appointments.appendChild(appointmentHTML);

        //consult next registers
        cursor.continue();
      } else {
        // eslint-disable-next-line no-lonely-if
        if (!appointments.firstChild) {
          //when there is no registers
          adminHeading.textContent = 'Agrega citas para comenzar';
          let list = document.createElement('p');
          list.classList.add('text-center');
          list.textContent = 'No hay registros';
          appointments.appendChild(list);
        } else {
          adminHeading.textContent = 'Administra tus citas';
        }
      }
    };
  }

  function deleteAppointment(e) {
    let appointmentID = Number(
      e.target.parentElement.getAttribute('data-cita-id')
    );

    let transaction = DB.transaction(['citas'], 'readwrite');
    let objectStore = transaction.objectStore('citas');
    let request = objectStore.delete(1);

    transaction.oncomplete = () => {
      e.target.parentElement.parentElement.removeChild(e.target.parentElement);

      if (!appointments.firstChild) {
        //when there is no registers
        adminHeading.textContent = 'Agrega citas para comenzar';
        let list = document.createElement('p');
        list.classList.add('text-center');
        list.textContent = 'No hay registros';
        appointments.appendChild(list);
      } else {
        adminHeading.textContent = 'Administra tus citas';
      }
    };
  }
});
