using SeedApi.Core;
using WellKnownProto = Google.Protobuf.WellKnownTypes;

namespace SeedApi;

[Serializable]
public sealed class Metadata : Dictionary<string, MetadataValue?>
{
    public Metadata() { }

    public Metadata(IEnumerable<KeyValuePair<string, MetadataValue?>> value)
        : base(value.ToDictionary(e => e.Key, e => e.Value)) { }

    internal static Metadata FromProto(WellKnownProto.Struct value)
    {
        var result = new Metadata();
        foreach (var kvp in value.Fields)
        {
            result[kvp.Key] = kvp.Value != null ? MetadataValue.FromProto(kvp.Value) : null;
        }
        return result;
    }

    internal WellKnownProto.Struct ToProto()
    {
        var result = new WellKnownProto.Struct();
        foreach (var kvp in this)
        {
            result.Fields[kvp.Key] = kvp.Value?.ToProto();
        }
        return result;
    }

    /// <inheritdoc />
    public override string ToString()
    {
        return JsonUtils.Serialize(this);
    }
}
