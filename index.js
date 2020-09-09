const LIGHT_THEME = 1;
const DARK_THEME = 0;

var numOfSubnetsInput = document.getElementById("numOfSubnetsInput");
var subnetInputTable = document.getElementById("subnetInputTable");
var networkAddressInput = document.getElementById("networkAddressInput");
var subnetResultTable = document.getElementById("subnetResultTable");
var currentTheme = LIGHT_THEME;
var currentRows = 0;

function addRow() {
    let row = subnetInputTable.insertRow();
    let subnetNameCell = row.insertCell();
    let numOfHostsCell = row.insertCell();

    let subnetNameInput = document.createElement("input");
    
    subnetNameInput.type = "text";
    subnetNameInput.className = "subnetNameInput";
    subnetNameInput.value = "Subnet " + (currentRows + 1).toString();

    let numOfHostsInput = document.createElement("input");
    
    numOfHostsInput.type = "number";
    numOfHostsInput.className = "numOfHostsInput";

    subnetNameCell.appendChild(subnetNameInput);
    numOfHostsCell.appendChild(numOfHostsInput);

    currentRows++;
}

function removeRow() {
    subnetInputTable.deleteRow(currentRows);
    currentRows--;
}

function generateSubnetInputTable() {
    let numOfSubnets = numOfSubnetsInput.value;
    
    for (i = 0; i < numOfSubnets; i++) {
        addRow();
    }
}

function changeSubnetInputTable() {
    let numOfSubnets = numOfSubnetsInput.value;
    let errorSpan = document.getElementById("numOfSubnetsErrorSpan");
    
    let rowsBeforeChange = currentRows;

    if (numOfSubnets <= 0) {
        numOfSubnetsInput.value = 0;
        errorSpan.innerHTML = "Invalid number of subnets";
    } else {
        errorSpan.innerHTML = "";
        if (numOfSubnets < currentRows) {
            for (i = 0; i < rowsBeforeChange - numOfSubnets; i++) removeRow();
        } else if (numOfSubnets > currentRows) {
            for (i = 0; i < numOfSubnets - rowsBeforeChange; i++) addRow();        
        }
    }
}

function generateResultTable(results) {
    let subnetResultTableInfo = document.getElementById("subnetResultTableInfo");
    let tableHeader = subnetResultTable.insertRow();
    let headerElements = ["Subnet", "REQ", "MAX", "Network", 
        "SUFF ", "Subnet mask", "First host", "Last host", "Broadcast"];
    
    for (headerElement of headerElements) {
        let th = document.createElement("th");
        th.innerHTML = headerElement;
        tableHeader.appendChild(th);
    }

    for (result of results) {
        let tableRow = subnetResultTable.insertRow();
        
        for (prop in result) {
            let tableCell = tableRow.insertCell();
            tableCell.innerHTML = result[prop].toString().replace(/,/g, ".");
        }
    }

    subnetResultTableInfo.style.display = "block";
}

function generateSubnetResults() {
    let networkAddress = networkAddressInput.value;
    let errorSpan = document.getElementById("subnetInputErrorSpan");

    if(validateIpAddressCIDR(networkAddress) == false) {
        let errorSpan = document.getElementById("networkAddressErrorSpan");
        errorSpan.innerHTML = "Invalid IPv4 address";
        return;
    }

    let subnetNameInputs = document.getElementsByClassName("subnetNameInput");
    let numOfHostsInputs = document.getElementsByClassName("numOfHostsInput")

    for (subnetNameInput of subnetNameInputs) {
        if (subnetNameInput.value.length == 0) {
            errorSpan.innerHTML = "All data in the table must be eneterd!";
            return;
        }
    }

    for (numOfHostsInput of numOfHostsInputs) {
        if (numOfHostsInput.value <= 0) {
            errorSpan.innerHTML = "All data in the table must be eneterd!";
            return;
        }
    }

    errorSpan.innerHTML = "";

    let subnetInputData = [];

    /* key - subnet name, value - number of hosts*/
    for (i = 0; i < subnetNameInputs.length; i++) {
        subnetInputData.push({
            subnetName: subnetNameInputs[i].value, 
            numOfHosts: Number(numOfHostsInputs[i].value)
        });
    }

    try {
        errorSpan.innerHTML = "";
        let results = calculateSubnets(networkAddress, subnetInputData);
        generateResultTable(results);
    } catch (exception) {
        errorSpan.innerHTML = exception;
    }
}

function changeTheme() {
    let themeLink = document.getElementById("theme");
    
    switch(currentTheme) {
        case LIGHT_THEME:
            themeLink.setAttribute("href", "darkTheme.css");
            currentTheme = DARK_THEME;
            break;
        case DARK_THEME:
            themeLink.setAttribute("href", "lightTheme.css");
            currentTheme = LIGHT_THEME;
            break;
    }
}

generateSubnetInputTable();

// Color scheme changes acording to system theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    changeTheme();
});
