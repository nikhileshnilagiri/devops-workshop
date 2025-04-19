namespace Reewild.AppHost.Extensions;

public static class CosmosDbReference
{
    public static IResourceBuilder<ProjectResource> WithCosmosDbReference(this IResourceBuilder<ProjectResource> projectResource, IResourceBuilder<IResourceWithConnectionString> cosmosDb, bool isRunMode)
    {
        return isRunMode ? projectResource.WithReference(cosmosDb) : projectResource.WithReference(cosmosDb).WaitFor(cosmosDb);
    }
}