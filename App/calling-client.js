const { CommunicationIdentityClient } = require('@azure/communication-identity');
import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

//Enable logging
import { setLogLevel } from '@azure/logger';
setLogLevel('verbose');

let call;
let callAgent;
console.log("Azure Communication Services - Boris' Calling App")

// Inputs and buttons
const callerNameInput = document.getElementById("caller-name-input");
const generateIdButton = document.getElementById("generate-id-button");
const callerIdInput = document.getElementById("caller-id-input");
const calleePhoneInput = document.getElementById("callee-phone-input");
const callPhoneButton = document.getElementById("call-phone-button");
const hangUpPhoneButton = document.getElementById("hang-up-phone-button");

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const identityClient = new CommunicationIdentityClient(connectionString);

// Instantiate the identity client
// Issue an access token with a validity of 24 hours and the "voip" scope for an identity

generateIdButton.addEventListener("click", async () => {
let identityResponse = await identityClient.createUser();
let tokenResponse = await identityClient.getToken(identityResponse, ["voip"]);
  console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);


const { token, expiresOn } = tokenResponse;

let output1 = document.querySelector('.output1');
let output2 = document.querySelector('.output2');
let output3 = document.querySelector('.output3');

output1.textContent = (`Created an identity with ID: ${identityResponse.communicationUserId}`); 

output2.textContent = (`Issued an access token with 'voip' scope that expires at ${expiresOn}`);

output3.textContent = (`Token: ${token}`);

console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
console.log(token)

// Create CallAgent
const callClient = new CallClient();
const callerName = callerNameInput.value;
const tokenCredential = new AzureCommunicationTokenCredential(token);
callAgent = await callClient.createCallAgent(tokenCredential, { displayName: callerName });
console.log(callAgent);
});

// Make call
callPhoneButton.addEventListener("click", () => {
    // start a call to phone
    const phoneToCall = calleePhoneInput.value;
    const callerId = callerIdInput.value;
    call = callAgent.startCall(
      [{phoneNumber: phoneToCall}], { alternateCallerId: {phoneNumber: callerId}
    });
    // toggle button states
    hangUpPhoneButton.disabled = false;
    callPhoneButton.disabled = true;
  });

  hangUpPhoneButton.addEventListener("click", () => {
    // end the current call
    call.hangUp({
      forEveryone: true
    });
  
    // toggle button states
    hangUpPhoneButton.disabled = true;
    callPhoneButton.disabled = false;
  });