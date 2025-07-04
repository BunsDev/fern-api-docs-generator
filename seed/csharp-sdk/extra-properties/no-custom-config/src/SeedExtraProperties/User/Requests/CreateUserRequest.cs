using System.Text.Json.Serialization;
using SeedExtraProperties.Core;

namespace SeedExtraProperties;

[Serializable]
public record CreateUserRequest
{
    [JsonPropertyName("_type")]
    public string Type { get; set; } = "CreateUserRequest";

    [JsonPropertyName("_version")]
    public string Version { get; set; } = "v1";

    [JsonPropertyName("name")]
    public required string Name { get; set; }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
