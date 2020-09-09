/**
 * Validates an ipv4 address.
 * @param {string} ipAddress - Ipv4 address to validate.
 * @returns {boolean} Returns true if ipv4 address is valid, false if not.
 */
function validateIpAddress(ipAddress) {
    let ipRegex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
    
    if (ipRegex.test(ipAddress)) return true  
    else return false;
}

/**
 * Validates an ipv4 address with the network mask suffix.
 * @param {string} ipCIDR - Ipv4 address with the network suffix (ex: 192.168.1.1/24)
 * @returns {boolean} Returns true if ipv4 address and suffix are valid, false if not. 
 */
function validateIpAddressCIDR(ipCIDR) {
    let ipAddress = ipCIDR.split("/")[0];
    let suffixStr = ipCIDR.split("/")[1];

    if (suffixStr == null) return false;
    if (ipAddress == null) return false;

    let suffix = Number(suffixStr);


    if (validateIpAddress(ipAddress) == false) return false;
    
    if (suffix < 0 || suffix > 32) return false;
    else return true;
}

/**
 * Gets an address part (no suffix) from ip address string.
 * For example: 192.168.1.1/24 -> 192.168.1.1
 * @param {string} ipCIDR - Ipv4 address with the network suffix (ex: 192.168.1.1/24)
 * @returns {string} Address part (no suffix)
 */
function getIp(ipCIDR) {
    return ipCIDR.split("/")[0];
}

/**
 * Gets the subnet suffix
 * @param {string} ipCIDR - Ipv4 address with the network suffix (ex: 192.168.1.1/24) 
 * @returns {number} Subnet mask suffix
 */
function getSuffix(ipCIDR) {
    return Number(ipCIDR.split("/")[1]);
}

/**
 * Takes a ip string and turns it into ipv4 address.
 * For exmpale: "192.168.1.1" -> [192, 168, 1, 1]
 * @param {string} ipCIDR - Ipv4 address (ex: 192.168.1.1) 
 * @returns {Array<number>} Array of 4 ip octets
 */
function ipToOctets(ip) {
    let stringOctets = ip.split(".");
    let numericOctets = [];

    for (stringOctet of stringOctets) {
        numericOctets.push(Number(stringOctet));
    }

    return numericOctets;
}

/**
 * Takes a subnet mask suffix and turns it into ipv4 address.
 * For exmpale: 24 -> [255, 255, 255, 0]
 * @param {number} suffix - subnet mask suffix
 * @returns {Array<number>} Array of octets (4 numbers)
 */
function suffixToOctetes(suffix) {
    let binaryIpString = "";
    let octets = [];

    for (i = 0; i < suffix; i++) binaryIpString += "1";

    for (i = suffix; i < 32; i++) binaryIpString += "0";

    octets.push(parseInt(binaryIpString.substring(0, 8), 2));
    octets.push(parseInt(binaryIpString.substring(8, 16), 2));
    octets.push(parseInt(binaryIpString.substring(16, 24), 2));
    octets.push(parseInt(binaryIpString.substring(24, 32), 2));

    return octets;
}

/**
 * Finds the next larger power of 2.
 * If 4 is given, returns 8.
 * If 10 is given returns 16.
 * @param {number} x - Given number
 * @returns {number} Next larger power of 2
 */
function nextPowerOfTwo(x) {
    let currentNumber = 2;
    while (x > currentNumber) {
        currentNumber *= 2;
    }
    return currentNumber;
}

/**
 * Bitwise AND on 2 ip addresses
 * @param {Array<number>} ip1 - Array of octets of 1. ip address (4 numbers)
 * @param {Array<number>} ip2 - Array of octets of 2. ip address(4 numbers)
 * @returns {Array<number>} Array of octets (4 numbers) 
 */
function ipAnd(ip1, ip2) {
    let result = [];
    for (i = 0; i < 4; i++) {
        result.push((ip1[i] & ip2[i]) >>> 0);
    }
    return result;
}

/**
 * Bitwise OR on 2 ip addresses
 * @param {Array<number>} ip1 - Array of octets of 1. ip address (4 numbers)
 * @param {Array<number>} ip2 - Array of octets of 2. ip address(4 numbers)
 * @returns {Array<number>} Array of octets (4 numbers) 
 */
function ipOr(ip1, ip2) {
    let result = [];
    for (i = 0; i < 4; i++) {
        result.push((ip1[i] | ip2[i]) >>> 0);
    }
    return result;
}

/**
 * Turns a number to 8 bit byte string.
 * For example: 2 -> 00000010
 * @param {number} Given - number 
 * @returns {string} String representing 8 bit binary number
 */
function numToStringByte(n) {
    return ("000000000" + n.toString(2)).substr(-8);
}

/**
 * Bitwise NOT on ip address
 * @param {Array<number>} ip - Array of octets of an ip address (4 numbers)
 * @returns {Array<number>} Array of octets (4 numbers) 
 */
function ipNot(ip) {
    let result = [];
    for (i = 0; i < 4; i++) {
        let stringByte = numToStringByte(ip[i]);
        let stringByteNot = "";
        for (j = 0; j < 8; j++) {
            stringByte.charAt(j) == "1"
                ? stringByteNot += "0"
                : stringByteNot += "1";
        }
        result.push(parseInt(stringByteNot, 2));
    }
    return result;
}

/**
 * Bitwise NOT on ip address
 * @param {Array<number>} ip - Array of octets of an ip address (4 numbers)
 * @returns {Array<number>} Array of octets (4 numbers) 
 */
function incrementIp(ip) {

    let result = [];
    for (octet of ip) result.push(octet);

    if ((result[3] + 1) > 255) {
        result[3] = 0;
        if ((result[2] + 1) > 255) {
            result[2] = 0;
            if ((result[1] + 1) > 255) {
                result[1] = 0;
                if ((result[0] + 1) > 255) {
                    throw "Too many hosts for given network!";
                } else {
                    result[0] += 1;
                }
            } else {
                result[1] += 1;
            }
        } else {
            result[2] += 1;
        }
    } else {
        result[3] += 1;
    }

    return result;
}

/**
 * Logarithm function
 * @param {number} x - Base
 * @param {number} y - Number
 * @returns {number} Logarithm result 
 */
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

/**
 * Calculates ip addresses of subnets for given subnet data
 * @param {string} ipCIDR - Ipv4 address with the network suffix (ex: 192.168.1.1/24)
 * @param {Array<Object>} subnetData - List of key value subnet data.
 * @returns {Array<Object>} Results
 */
function calculateSubnets(ipCIDR, subnetData) {
    
    // sort subnetInputData by number of hosts descending */
    subnetData.sort((a, b) => {
        if (a.numOfHosts > b.numOfHosts) return -1;
        else return 1;
    })

    let results = [];

    let ip = ipToOctets(getIp(ipCIDR));
  
    for (subnet of subnetData) {
        /* If 20 hosts are requested, calculation should be done as
         * 22 hosts are requested, because 2 addresses are reserved for
         * network and broadcast address */
        let maxHostNum = nextPowerOfTwo(subnet.numOfHosts + 2);
        let subnetSuffix = 32 - getBaseLog(2, maxHostNum);
        let subnetMask = suffixToOctetes(subnetSuffix);
        let networkAddress = ipAnd(ip, subnetMask);
        let firstHost = ipOr(networkAddress, [0, 0, 0, 1]);
        let broadcast = ipOr(networkAddress, ipNot(suffixToOctetes(subnetSuffix)));
        let lastHost = ipAnd(broadcast, [255, 255, 255, 254]);
    
        results.push({
            "subnetName" : subnet.subnetName,
            "requiredHosts" : subnet.numOfHosts,
            "maxHostNum" : maxHostNum - 2,
            "networkAddress" : networkAddress,
            "subnetSuffix" : "/" + subnetSuffix.toString(),
            "subnetMask" : subnetMask,
            "firstHost" : firstHost,
            "lastHost" : lastHost,
            "broadcast" : broadcast
        });
        
        ip = incrementIp(broadcast);
    }

    results.sort((a, b) => {
        if (a.requiredHosts > b.requiredHosts) return -1;
        else return 1;
    })
    
    return results;
}