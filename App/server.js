const express = require("express");
const { CommunicationIdentityClient } = require("@azure/communication-identity");

const app = express();
const port = process.env.PORT || 1234;

app.get("/token", async (_req, res) => {
  try {
    const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;

    if (!connectionString) {
      return res.status(500).json({ error: "Missing COMMUNICATION_SERVICES_CONNECTION_STRING" });
    }

    const client = new CommunicationIdentityClient(connectionString);
    const user = await client.createUser();
    const tokenResponse = await client.getToken(user, ["voip"]);

    res.json({
      userId: user.communicationUserId,
      token: tokenResponse.token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err.message || err) });
  }
});

app.use(express.static("dist"));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
