using System.Text.Json.Nodes;
using Azure.Communication;
using Azure.Communication.CallAutomation;
using Azure.Messaging.EventGrid;
using Azure.Messaging.EventGrid.SystemEvents;
using Microsoft.AspNetCore.Mvc;


var builder = WebApplication.CreateBuilder(args);

var client = new CallAutomationClient("endpoint=https://dr-test.communication.azure.com/;accesskey=/n8h23wF40ZeOuNyPexr8/rHH+mA3wdn46EFxAMz43U2tYDy5SrEIFLYmgVp6M92+VJR0VJMDLNtdqsSY5M44Q==");

var app = builder.Build();

app.MapPost("/api/incomingCall", async (
    [FromBody] EventGridEvent[] eventGridEvents) =>
    {
        foreach (var eventGridEvent in eventGridEvents)
        {
            if (eventGridEvent.TryGetSystemEventData(out object eventData))
            {
                // Handle the subscription validation event.
                if (eventData is SubscriptionValidationEventData subscriptionValidationEventData)
                {
                    var responseData = new SubscriptionValidationResponse
                    {
                        ValidationResponse = subscriptionValidationEventData.ValidationCode
                    };
                    return Results.Ok(responseData);
                }
            }
            
            var jsonObject = JsonNode.Parse(eventGridEvent.Data).AsObject();
            var incomingCallContext = (string)jsonObject["incomingCallContext"];
            await client.RedirectCallAsync(incomingCallContext, new PhoneNumberIdentifier("+79055003860")); //this can be any phone number you have access to and should be provided in format +(countrycode)(phonenumber)
        }

        return Results.Ok();
    });

app.Run();