package main.java.test;

import java.util.Collections;
import java.util.concurrent.atomic.AtomicReference;
import javax.json.Json;
import javax.json.JsonBuilderFactory;
import javax.json.JsonObject;
import io.helidon.config.Config;
import io.helidon.webserver.Routing;
import io.helidon.webserver.ServerRequest;
import io.helidon.webserver.ServerResponse;
import io.helidon.webserver.Service;

public class GreetService implements Service {

    private static final JsonBuilderFactory JSON = Json.createBuilderFactory(Collections.emptyMap());

    @Override
    public void update(Routing.Rules rules) {
        rules
            .get("/", this::getDefaultMessageHandler);
    }

    private void getDefaultMessageHandler(ServerRequest request, ServerResponse response) {
        sendResponse(response, "World");
    }

    private void sendResponse(ServerResponse response, String name) {
        String msg = String.format("%s %s!", "Hello", name);

        JsonObject returnObject = JSON.createObjectBuilder()
                .add("message", msg)
                .build();
        response.send(returnObject);
    }
}