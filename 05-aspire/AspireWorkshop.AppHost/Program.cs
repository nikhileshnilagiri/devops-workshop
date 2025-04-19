using Reewild.AppHost.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

// var cosmosDb = builder.AddAzureCosmosDB("cosmosDb")
//                     .AddDatabase("workshop")

// if (builder.ExecutionContext.IsRunMode)
// {
// cosmosDb.RunAsEmulator(cfgContainer =>
// {
//     cfgContainer
//         .WithHttpEndpoint(targetPort: 1234, name: "explorer-port", isProxied: false)
//         .WithImageRegistry("mcr.microsoft.com")
//         .WithImage("cosmosdb/linux/azure-cosmos-emulator")
//         .WithImageTag("vnext-preview")
//         .WithArgs("--protocol", "https")
//         .WithLifetime(ContainerLifetime.Persistent)
//         .WithDataVolume("cosmosdb-data-volume")
//         .WithArgs("--explorer-protocol", "http");
// });
// }

var cache = builder.AddRedis("inf-cache")
                   .WithRedisInsight()
                   .WithRedisCommander();

var messaging = builder.AddRabbitMQ("inf-messaging")
                 .WithLifetime(ContainerLifetime.Persistent)
                 .WithManagementPlugin();


builder.AddDiscoverableDockerfile("p-express-mock-api", "../express-mock-mirror/api")
    .WithHttpEndpoint(targetPort: 80)
    .WithOtlpExporter();




var apiService = builder.AddProject<Projects.AspireWorkshop_ApiService>("apiservice")
    .WithHttpsHealthCheck("/health");

builder.AddProject<Projects.AspireWorkshop_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpsHealthCheck("/health")
    .WithReference(apiService)
    .WaitFor(apiService);

var healthCheckWebApp = builder.AddDiscoverableDockerfile("a-int-health-web", "../health-check-web-app")
    .WithHttpEndpoint(targetPort: 80)
    .WithExternalHttpEndpoints()
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
