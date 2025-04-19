namespace Reewild.AppHost.Extensions
{
    public static class DiscoverableDockerContainerResourceBuilderExtensions
    {
        //https://dev.to/rockfire/aspire-three-ways-of-registry-service-discovery-for-non-net-microservices-234
        public static IResourceBuilder<DiscoverableDockerContainerResource> AddDiscoverableDockerfile(this IDistributedApplicationBuilder builder, string name, string workingDirectory, string dockerfilePath = "Dockerfile")
        {   
            return builder.AddResource(new DiscoverableDockerContainerResource(name))
                .WithImage("placeholder") //Image name will be replaced by WithDockerfile.
                .WithEnvironment("EXECUTION_CONTEXT",builder.ExecutionContext.IsRunMode? "development" : "production")
                .WithDockerfile(workingDirectory, dockerfilePath);
        }
    }
    public class DiscoverableDockerContainerResource(string name): ContainerResource(name), IResourceWithServiceDiscovery
    {
    }
}