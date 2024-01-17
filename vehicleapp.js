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

// class for the owner
class Owner {
  constructor(name) {
    this.name = name;
    this.vehicles = [];
  }
// method for adding a new vehicle to the vehicles array defined above
  addVehicle(name, year, color) {
    this.vehicles.push(new Vehicle(name, year, color));
  }
}
// class for vehicles
class Vehicle {
  constructor(name, year, color) {
    this.name = name;
    this.year = year;
    this.color = color;
  }
}

// class for VehicleService which performs the CRUD operations
class VehicleService {
  // my endpoint pointing to the db.josn file I have, I tried with a mock API as well 
  static URL_ENDPOINT = "http://localhost:3000/vehicleRegistry";
  // static URL_ENDPOINT =
  //  "https://65a6ae9974cf4207b4f0a100.mockapi.io/VehicleRegistry";

  // method for fetching and interacting with the API
  static getAllOwners() {
    return $.get(this.URL_ENDPOINT);
  }

  static getOwner(id) {
    return $.get(this.URL_ENDPOINT + `/${id}`);
  }
//  method for creating a new owner, performs an AJAX call to post to the endpoint
  static createOwner(owner) {
    return $.ajax({
      url: this.URL_ENDPOINT,
      dataType: "json",
      data: JSON.stringify(owner),
      contentType: "application/json",
      type: "POST",
    });
  }
// method for to update owner information
  static updateOwner(owner) {
    return $.ajax({
      url: this.URL_ENDPOINT + `/${owner.id}`,
      dataType: "json",
      data: JSON.stringify(owner),
      contentType: "application/json",
      type: "PUT",
    });
  }
// method for deleting an owner
  static deleteOwner(id) {
    return $.ajax({
      url: this.URL_ENDPOINT + `/${id}`,
      type: "DELETE",
    });
  }
}
// Class for managing the DOM (rendering owners and vehicles)
class DOMManager {
  static owners;
 // Fetch all owners and render them
  static getAllOwners() {
    VehicleService.getAllOwners().then((owners) => this.render(owners));
  }
// Create a new owner and render all owners
  static createOwner(name) {
    VehicleService.createOwner(new Owner(name))
      .then(() => {
        return VehicleService.getAllOwners();
      })
      .then((owners) => this.render(owners));
  }
  // Delete an owner and render all owners
  static deleteOwner(id) {
    VehicleService.deleteOwner(id)
      .then(() => {
        return VehicleService.getAllOwners();
      })
      .then((owners) => this.render(owners));
  }
// Add a vehicle to an owner and render all owners, pushes to vehicle array
  static addVehicle(id) {
    for (let owner of this.owners) {
      if (owner.id === id) {
        owner.vehicles.push(
          new Vehicle(
            $(`#${owner.id}-vehicle-name`).val(),
            $(`#${owner.id}-vehicle-year`).val(),
            $(`#${owner.id}-vehicle-color`).val()
          )
        );
        VehicleService.updateOwner(owner)
          .then(() => {
            return VehicleService.getAllOwners();
          })
          .then((owners) => this.render(owners));
      }
    }
  }
// Delete a vehicle from an owner and render all owner
  static deleteVehicle(ownerId, vehicleName) {
    console.log("Deleting vehicle:", ownerId, vehicleName);
    for (let owner of this.owners) {
      if (owner.id == ownerId) {
        for (let vehicle of owner.vehicles) {
          if (vehicle.name == vehicleName) {
            owner.vehicles.splice(owner.vehicles.indexOf(vehicle), 1);
            VehicleService.updateOwner(owner)
              .then(() => {
                return VehicleService.getAllOwners();
              })
              .then((owners) => this.render(owners));
          }
        }
      }
    }
  }
// Render owners and their vehicles
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
    // Display vehicles for the owner
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
                onclick="DOMManager.deleteVehicle('${owner.id}', '${vehicle.name}')"
              >
                Delete Vehicle
              </button>
            </p> `
          );
      }
    }
  }
}

// Event listener for creating a new owner
$("#create-new-owner").click((e) => {
  e.preventDefault();
  DOMManager.createOwner($("#fullName").val());
  $("#fullName").val("");
});

// Initial fetch and render of owners
DOMManager.getAllOwners();
