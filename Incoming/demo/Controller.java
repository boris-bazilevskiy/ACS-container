package com.example.demo;

import com.azure.communication.callautomation.*;
import com.azure.communication.callautomation.models.*;
import com.azure.communication.callautomation.models.events.*;
import com.azure.communication.common.CommunicationIdentifier;
import com.azure.communication.common.PhoneNumberIdentifier;
import com.azure.messaging.eventgrid.EventGridEvent;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationEventData;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.*;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

package com.example.demo;

import com.azure.communication.callautomation.*;
import com.azure.communication.callautomation.models.*;
import com.azure.communication.callautomation.models.events.*;
import com.azure.communication.common.CommunicationIdentifier;
import com.azure.communication.common.PhoneNumberIdentifier;
import com.azure.messaging.eventgrid.EventGridEvent;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationEventData;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.*;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class ActionController {
    private CallAutomationAsyncClient client;
    private String connectionString = "endpoint=https://dr-test.communication.azure.com/;accesskey=/n8h23wF40ZeOuNyPexr8/rHH+mA3wdn46EFxAMz43U2tYDy5SrEIFLYmgVp6M92+VJR0VJMDLNtdqsSY5M44Q=="; //noted from pre-requisite step    
    
private CallAutomationAsyncClient getCallAutomationAsyncClient() {
        if (client == null) {
            client = new CallAutomationClientBuilder()
                .connectionString(connectionString)
                .buildAsyncClient();
        }
        return client;
    }
    @RequestMapping(value = "/api/incomingCall", method = POST)
    public ResponseEntity<?> handleIncomingCall(@RequestBody(required = false) String requestBody) {
        List<EventGridEvent> eventGridEvents = EventGridEvent.fromString(requestBody);
        for (EventGridEvent eventGridEvent : eventGridEvents) {
            // Handle the subscription validation event            
            if (eventGridEvent.getEventType().equals("Microsoft.EventGrid.SubscriptionValidationEvent")) {
                SubscriptionValidationEventData subscriptionValidationEventData = eventGridEvent.getData().toObject(SubscriptionValidationEventData.class);
                SubscriptionValidationResponse subscriptionValidationResponse = new SubscriptionValidationResponse()
                        .setValidationResponse(subscriptionValidationEventData.getValidationCode());
                ResponseEntity<SubscriptionValidationResponse> ret = new ResponseEntity<>(subscriptionValidationResponse, HttpStatus.OK);
                return ret;
            }
          JsonObject data = new Gson().fromJson(eventGridEvent.getData().toString(), JsonObject.class);
          String incomingCallContext = data.get("incomingCallContext").getAsString();
          CommunicationIdentifier target = new PhoneNumberIdentifier("+79055003860");
          RedirectCallOptions redirectCallOptions = new RedirectCallOptions(incomingCallContext, target); 
          Response<Void> response = getCallAutomationAsyncClient().redirectCallWithResponse(redirectCallOptions).block();                               
        }
        
        return new ResponseEntity<>(HttpStatus.OK);
    }
}