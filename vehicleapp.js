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
    constructor (name, year, color) {
        this.name = name;
        this.year = year;
        this.color = color;
    }
}

class VehicleService {
    static URL_ENDPOINT = 'http://localhost:3000/vehicleRegistry'

    static getAllOwners() {
        return $.get(this.URL_ENDPOINT);
    }

    static getOwner(id) {
        return $.get(this.URL_ENDPOINT + `/${id}`);
    }

    static createOwner(owner) {
        return $.post(this.URL_ENDPOINT, owner);
    }

    static updateOwner(owner) {
        return $.ajax({
            url: this.URL_ENDPOINT + `/${owner._id}`,
            dataType: 'json',
            data: JSON.stringify(owner),
            contentType: 'application/json',
            type: 'PUT'
            
        });
    }

    static deleteOwner(id) {
        return $.ajax({
            url: this.URL_ENDPOINT + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static owners;

    static getAllOwners() {
        VehicleService.getAllOwners().then(owners => this.render(owners));
    }

    static createOwner(name) {
        VehicleService.createOwner(new Owner (name))
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
        $('#app').empty();
        for (let owner of owners) {
            $('#app').prepend(
                `
                <div id="${owner._id}" class="card">
                    <div class="card-header">
                        <h2>${owner.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteOwner('${owner._id}')">Delete</button>

                    </div>
                    <div class="card-body">
                        <div class="card>
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${owner._id}-vehicle-name" class="form-control" placeholder="Vehicle">
                                </div>
                                <div class="col-sm">
                                <input type="text" id="${owner._id}-vehicle-year" class="form-control" placeholder="Vehicle Year">
                                </div>
                                <div class="col-sm">
                                <input type="text" id="${owner._id}-vehicle-color" class="form-control" placeholder="Vehicle Color">
                                </div>
                            </div>
                            <button id="${owner._id}-new-vehicle" onclick="DOMManager.addVehicle('${owner._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`   
            );
            for (let vehicle of owner.vehicles) {
                $(`#${owner._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${vehicle._id}"><strong>Name: </strong> ${vehicle.name}</span>
                        <span id="year-${vehicle._id}"><strong>Year: </strong> ${vehicle.year}</span>
                        <span id="color-${vehicle._id}"><strong>Color: </strong> ${vehicle.color}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteVehicle('${owner._id}', '${vehicle._id}')">Delete Vehicle</button>
                    `
                );
            }
        }
    }
}

$('#create-new-owner').click(() => {
    DOMManager.createOwner($('#fullName').val());
    $('#fullName').val('');
});

DOMManager.getAllOwners();