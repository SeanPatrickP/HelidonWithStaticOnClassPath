package main.java.test;

import io.helidon.common.LogConfig;
import io.helidon.common.reactive.Single;
import io.helidon.health.HealthSupport;
import io.helidon.health.checks.HealthChecks;
import io.helidon.media.jsonp.JsonpSupport;
import io.helidon.metrics.MetricsSupport;
import io.helidon.webserver.Routing;
import io.helidon.webserver.StaticContentSupport;
import io.helidon.webserver.WebServer;

/**
 * The application main class.
 */
public final class Main {

    /**
     * Cannot be instantiated.
     */
    private Main() {
    }

    /**
     * Application main entry point.
     * @param args command line arguments.
     */
    public static void main(final String[] args) {
        startServer();
    }

    /**
     * Start the server.
     * @return the created {@link WebServer} instance
     */
    static Single<WebServer> startServer() {

        LogConfig.configureRuntime();

        WebServer server = WebServer.builder(createRouting())
                .port(8080)
                .addMediaSupport(JsonpSupport.create())
                .build();

        Single<WebServer> webserver = server.start();

        webserver.thenAccept(ws -> {
                    System.out.println("WEB server is up! http://localhost:" + ws.port());
                })
                .exceptionallyAccept(t -> {
                    System.err.println("Startup failed: " + t.getMessage());
                    t.printStackTrace(System.err);
                });

        return webserver;
    }

    /**
     * Creates new {@link Routing}.
     *
     * @return routing configured with JSON support, a health check, and a service
     * @param config configuration of this server
     */
    private static Routing createRouting() {

        MetricsSupport metrics = MetricsSupport.create();
        GreetService greetService = new GreetService();
        HealthSupport health = HealthSupport.builder()
                .addLiveness(HealthChecks.healthChecks())   // Adds a convenient set of checks
                .build();

        return Routing.builder()
                .register(health)                   // Health at "/health"
                .register(metrics)                  // Metrics at "/metrics"
                .register("/api/greet", greetService)
                .register("/", StaticContentSupport.builder("/site")
                    .welcomeFileName("index.html")
                    .build())
                .build();
    }
}
