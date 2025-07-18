using System.Text.Json;
using System.Text.Json.Serialization;
using SeedApi.Core;
using ProtoDataV1Grpc = Data.V1.Grpc;

namespace SeedApi;

[Serializable]
public record QueryColumn : IJsonOnDeserialized
{
    [JsonExtensionData]
    private readonly IDictionary<string, JsonElement> _extensionData =
        new Dictionary<string, JsonElement>();

    [JsonPropertyName("values")]
    public ReadOnlyMemory<float> Values { get; set; }

    [JsonPropertyName("topK")]
    public uint? TopK { get; set; }

    [JsonPropertyName("namespace")]
    public string? Namespace { get; set; }

    [JsonPropertyName("filter")]
    public Metadata? Filter { get; set; }

    [JsonPropertyName("indexedData")]
    public IndexedData? IndexedData { get; set; }

    [JsonIgnore]
    public ReadOnlyAdditionalProperties AdditionalProperties { get; private set; } = new();

    /// <summary>
    /// Returns a new QueryColumn type from its Protobuf-equivalent representation.
    /// </summary>
    internal static QueryColumn FromProto(ProtoDataV1Grpc.QueryColumn value)
    {
        return new QueryColumn
        {
            Values = value.Values?.ToArray() ?? new ReadOnlyMemory<float>(),
            TopK = value.TopK,
            Namespace = value.Namespace,
            Filter = value.Filter != null ? Metadata.FromProto(value.Filter) : null,
            IndexedData =
                value.IndexedData != null ? IndexedData.FromProto(value.IndexedData) : null,
        };
    }

    void IJsonOnDeserialized.OnDeserialized() =>
        AdditionalProperties.CopyFromExtensionData(_extensionData);

    /// <summary>
    /// Maps the QueryColumn type into its Protobuf-equivalent representation.
    /// </summary>
    internal ProtoDataV1Grpc.QueryColumn ToProto()
    {
        var result = new ProtoDataV1Grpc.QueryColumn();
        if (!Values.IsEmpty)
        {
            result.Values.AddRange(Values.ToArray());
        }
        if (TopK != null)
        {
            result.TopK = TopK ?? 0;
        }
        if (Namespace != null)
        {
            result.Namespace = Namespace ?? "";
        }
        if (Filter != null)
        {
            result.Filter = Filter.ToProto();
        }
        if (IndexedData != null)
        {
            result.IndexedData = IndexedData.ToProto();
        }
        return result;
    }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
