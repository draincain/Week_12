/* 
   lit-html snippet - Begin
   Add to the top of your code. Works with html or jsx!
   Formats html in a template literal  using the lit-html library 
   Syntax: html`<div> html or jsx here! ${variable} </div>`
*/
//lit-html snippet - Begin
let html = (strings, ...values) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
//lit-html snippet - End

class Owner {
  constructor(name) {
    this.name = name;
    this.vehicles = [];
  }

  addVehicle(name, year, color) {
    this.vehicles.push(new Vehicle(name, year, color));
  }
}

class Vehicle {
  constructor(name, year, color) {
    this.name = name;
    this.year = year;
    this.color = color;
  }
}

class VehicleService {
  //   static URL_ENDPOINT = "http://localhost:3000/vehicleRegistry";
  static URL_ENDPOINT =
    "https://65a6ae9974cf4207b4f0a100.mockapi.io/VehicleRegistry";

  static getAllOwners() {
    return $.get(this.URL_ENDPOINT);
  }

  static getOwner(id) {
    return $.get(this.URL_ENDPOINT + `/${id}`);
  }

  static createOwner(owner) {
    return $.ajax({
      url: this.URL_ENDPOINT,
      dataType: "json",
      data: JSON.stringify(owner),
      contentType: "application/json",
      type: "POST",
    });
  }

  static updateOwner(owner) {
    return $.ajax({
      url: this.URL_ENDPOINT + `/${owner.id}`,
      dataType: "json",
      data: JSON.stringify(owner),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteOwner(id) {
    return $.ajax({
      url: this.URL_ENDPOINT + `/${id}`,
      type: "DELETE",
    });
  }
}

class DOMManager {
  static owners;

  static getAllOwners() {
    VehicleService.getAllOwners().then((owners) => this.render(owners));
  }

  static createOwner(name) {
    VehicleService.createOwner(new Owner(name))
      .then(() => {
        return VehicleService.getAllOwners();
      })
      .then((owners) => this.render(owners));
  }

  static deleteOwner(id) {
    VehicleService.deleteOwner(id)
      .then(() => {
        return VehicleService.getAllOwners();
      })
      .then((owners) => this.render(owners));
  }

  static render(owners) {
    this.owners = owners;
    $("#app").empty();
    for (let owner of owners) {
      $("#app").prepend(
        html` <div id="${owner.id}" class="card">
            <div class="card-header">
              <h2>${owner.name}</h2>
              <button
                class="btn btn-danger"
                onclick="DOMManager.deleteOwner('${owner.id}')"
              >
                Delete
              </button>
            </div>
            <div class="card-body">
              <div class="card">
                <div class="row">
                  <div class="col-sm">
                    <input
                      type="text"
                      id="${owner.id}-vehicle-name"
                      class="form-control"
                      placeholder="Vehicle"
                    />
                  </div>
                  <div class="col-sm">
                    <input
                      type="text"
                      id="${owner.id}-vehicle-year"
                      class="form-control"
                      placeholder="Vehicle Year"
                    />
                  </div>
                  <div class="col-sm">
                    <input
                      type="text"
                      id="${owner.id}-vehicle-color"
                      class="form-control"
                      placeholder="Vehicle Color"
                    />
                  </div>
                </div>
                <button
                  id="${owner.id}-new-vehicle"
                  onclick="DOMManager.addVehicle('${owner.id}')"
                  class="btn btn-primary form-control"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <br />`
      );
      for (let vehicle of owner.vehicles) {
        $(`#${owner.id}`)
          .find(".card-body")
          .append(
            html`<p>
              <span id="name-${vehicle.id}"
                ><strong>Name: </strong> ${vehicle.name}</span
              >
              <span id="year-${vehicle.id}"
                ><strong>Year: </strong> ${vehicle.year}</span
              >
              <span id="color-${vehicle.id}"
                ><strong>Color: </strong> ${vehicle.color}</span
              >
              <button
                class="btn btn-danger"
                onclick="DOMManager.deleteVehicle('${owner.id}', '${vehicle.id}')"
              >
                Delete Vehicle
              </button>
            </p> `
          );
      }
    }
  }
}

$("#create-new-owner").click((e) => {
  e.preventDefault();
  DOMManager.createOwner($("#fullName").val());
  $("#fullName").val("");
});

DOMManager.getAllOwners();
