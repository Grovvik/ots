const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"; // default base58 mapping for OTS network

function hexToBytes(hex) {
    if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(byte => {
    const hex = byte.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

var to_b58 = function(B,A){var d=[],s="",i,j,c,n;for(i in B){j=0,c=B[i];s+=c||s.length^i?"":1;while(j in d||c){n=d[j];n=n?n*256+c:c;c=n/58|0;d[j]=n%58;j++}}while(j--)s+=A[d[j]];return s};
var from_b58 = function(S,A){var d=[],b=[],i,j,c,n;for(i in S){j=0,c=A.indexOf(S[i]);if(c<0)return undefined;c||b.length^i?i:b.push(0);while(j in d||c){n=d[j];n=n?n*58+c:c;c=n>>8;d[j]=n%256;j++}}while(j--)b.push(d[j]);return new Uint8Array(b)};

class Address {
    static fromKey(key) {
        return "t"+to_b58(hexToBytes(key), MAP);
    }
    static fromAddress(address) {
        if (address[0] == "t")
            return bytesToHex(from_b58(address.slice(1), MAP));
        else
            throw new Error(address+" is not an address in OTS network");
    }
}

module.exports = Address;