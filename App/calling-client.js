import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

let callAgent;
let deviceManager;
let call;
let cachedToken;

async function getAcsToken() {
  const response = await fetch("/token");

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

async function init() {
  try {
    const { token, userId } = await getAcsToken();

    cachedToken = token;

    document.getElementById("user-id-output").value = userId;

    const callClient = new CallClient();

    deviceManager = await callClient.getDeviceManager();
    await deviceManager.askDevicePermission({ audio: true, video: false });

    const tokenCredential = new AzureCommunicationTokenCredential(token);

    callAgent = await callClient.createCallAgent(tokenCredential);

    setupUI();
  } catch (err) {
    console.error("Init failed:", err);
    alert(err.message || err);
  }
}

function setupUI() {
  const callButton = document.getElementById("callButton");
  const hangUpButton = document.getElementById("hangUpButton");

  callButton.onclick = async () => {
    const callee = document.getElementById("callee-id-input").value.trim();
    const callerId = document.getElementById("caller-id-input").value.trim();
    const callerName =
      document.getElementById("caller-name-input").value.trim() || "ACS User";

    if (!callee) {
      alert("Enter callee");
      return;
    }

    try {
      // recreate agent if caller name or ID changes
      if (callAgent) {
        await callAgent.dispose();
      }

      const callClient = new CallClient();
      const tokenCredential = new AzureCommunicationTokenCredential(cachedToken);

      callAgent = await callClient.createCallAgent(tokenCredential, {
        displayName: callerName
      });

      let callOptions = {};

      // PSTN caller ID (IMPORTANT)
      if (callerId) {
        callOptions = {
          alternateCallerId: { phoneNumber: callerId }
        };
      }

      const target = callee.startsWith("8:acs:")
        ? { communicationUserId: callee }
        : { phoneNumber: callee };

      call = callAgent.startCall([target], callOptions);

      console.log("Call started");
    } catch (err) {
      console.error("Call failed:", err);
      alert(err.message || err);
    }
  };

  hangUpButton.onclick = async () => {
    if (!call) return;

    try {
      await call.hangUp({ forEveryone: false });
      call = undefined;
    } catch (err) {
      console.error("Hangup failed:", err);
    }
  };
}

init();