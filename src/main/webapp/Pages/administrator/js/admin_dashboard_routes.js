function openForm_add() {
    const existingForm = document.querySelector(".bus_add_form_body");

    if (!existingForm) {
        createForm();
    }

    document.getElementById("busRegForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_add() {
    document.getElementById("busRegForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function openForm_update() {
    const existingForm = document.querySelector(".bus_update_form_body");

    if (!existingForm) {
        createForm();
    }

    document.getElementById("busUpdateForm").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm_update() {
    document.getElementById("busUpdateForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Create the add and update forms
function createForm() {
    const form_add = document.createElement('div');
    form_add.classList.add('bus_add_form_body');

    const form_update = document.createElement('div');
    form_update.classList.add('bus_update_form_body');

    var form= `
        <div class="bus_form_left">
            <div class="form_div">
                <label for="owner_nic" class="bus_form_title">Starting Stand<span class="bus_form_require">*</span></label>
                <input type="text" name="owner_nic" id="owner_nic" class="form_data" placeholder="Enter Starting Stand" required="required" />
            </div>
            <div class="form_div">
                <label for="route" class="bus_form_title">Ending Stand<span class="bus_form_require">*</span></label>
                <input type="text" name="route" id="route" class="form_data" placeholder="Enter Ending Stand" required="required" />
            </div>
            <div class="form_div">
                <label for="engineNo" class="bus_form_title">Price Per Ride <span class="bus_form_require">*</span></label>
                <input type="text" name="engineNo" id="engineNo" class="form_data" placeholder="Enter Price Per Ride" required="required" />
            </div>
        </div>
        `;

    form_add.innerHTML = form.replace(/id="/g, 'id="add_');
    form_update.innerHTML = form.replace(/id="/g, 'id="update_');
    const formContainer_add = document.getElementById('formContainer_add');
    const formContainer_update = document.getElementById('formContainer_update');

    formContainer_add.appendChild(form_add.cloneNode(true)); // Clone the form
    formContainer_update.appendChild(form_update.cloneNode(true)); // Clone the form
}





