// Permissions
const tablePermissions = document.querySelector("table[table-permissions]");

if (tablePermissions) {
    const btnSubmit = document.querySelector("button[btn-submit]");

    btnSubmit.addEventListener("click", (e) => {
        const permissions = [];
        const rows = tablePermissions.querySelectorAll("tr[data-name]");

        rows.forEach((row) => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");

            if (name === "id") {
                inputs.forEach((input) => {
                    const id = input.value;

                    permissions.push({
                        id: id,
                        permissions: [],
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;

                    if (checked) permissions[index].permissions.push(name);
                });
            }
        });

        if (permissions.length > 0) {
            const formChangePermission = document.querySelector(
                "#form-change-permissions"
            );

            if (formChangePermission) {
                const inputPermission = formChangePermission.querySelector(
                    "input[name='permissions']"
                );

                inputPermission.value = JSON.stringify(permissions);
                formChangePermission.submit();
            }
        }
    });
}
// End Permissions

// Permissions data default
const dataRecords = document.querySelector("[data-records]");

if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("table[table-permissions]");

    records.forEach((record, index) => {
        const permissions = record.permissions;

        permissions.forEach((permission) => {
            const row = tablePermissions.querySelector(
                `tr[data-name='${permission}']`
            );
            const input = row.querySelectorAll("input")[index];

            input.checked = true;
        });
    });
}
// End Permissions data default
