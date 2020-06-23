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

    console.log(newAppointment);
  }
});
