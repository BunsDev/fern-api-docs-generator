using global::System.Threading.Tasks;
using NUnit.Framework;
using SeedTrace;
using SeedTrace.Core;

namespace SeedTrace.Test.Unit.MockServer;

[TestFixture]
public class UpdateProblemTest : BaseMockServerTest
{
    [NUnit.Framework.Test]
    public async global::System.Threading.Tasks.Task MockServerTest()
    {
        const string requestJson = """
            {
              "problemName": "problemName",
              "problemDescription": {
                "boards": [
                  {
                    "type": "html",
                    "value": "boards"
                  },
                  {
                    "type": "html",
                    "value": "boards"
                  }
                ]
              },
              "files": {
                "JAVA": {
                  "solutionFile": {
                    "filename": "filename",
                    "contents": "contents"
                  },
                  "readOnlyFiles": [
                    {
                      "filename": "filename",
                      "contents": "contents"
                    },
                    {
                      "filename": "filename",
                      "contents": "contents"
                    }
                  ]
                }
              },
              "inputParams": [
                {
                  "variableType": {
                    "type": "integerType"
                  },
                  "name": "name"
                },
                {
                  "variableType": {
                    "type": "integerType"
                  },
                  "name": "name"
                }
              ],
              "outputType": {
                "type": "integerType"
              },
              "testcases": [
                {
                  "testCase": {
                    "id": "id",
                    "params": [
                      {
                        "type": "integerValue",
                        "value": 1
                      },
                      {
                        "type": "integerValue",
                        "value": 1
                      }
                    ]
                  },
                  "expectedResult": {
                    "type": "integerValue",
                    "value": 1
                  }
                },
                {
                  "testCase": {
                    "id": "id",
                    "params": [
                      {
                        "type": "integerValue",
                        "value": 1
                      },
                      {
                        "type": "integerValue",
                        "value": 1
                      }
                    ]
                  },
                  "expectedResult": {
                    "type": "integerValue",
                    "value": 1
                  }
                }
              ],
              "methodName": "methodName"
            }
            """;

        const string mockResponse = """
            {
              "problemVersion": 1
            }
            """;

        Server
            .Given(
                WireMock
                    .RequestBuilders.Request.Create()
                    .WithPath("/problem-crud/update/problemId")
                    .UsingPost()
                    .WithBodyAsJson(requestJson)
            )
            .RespondWith(
                WireMock
                    .ResponseBuilders.Response.Create()
                    .WithStatusCode(200)
                    .WithBody(mockResponse)
            );

        var response = await Client.Problem.UpdateProblemAsync(
            "problemId",
            new CreateProblemRequest
            {
                ProblemName = "problemName",
                ProblemDescription = new ProblemDescription
                {
                    Boards = new List<ProblemDescriptionBoard>()
                    {
                        new ProblemDescriptionBoard(new ProblemDescriptionBoard.Html("boards")),
                        new ProblemDescriptionBoard(new ProblemDescriptionBoard.Html("boards")),
                    },
                },
                Files = new Dictionary<Language, ProblemFiles>()
                {
                    {
                        Language.Java,
                        new ProblemFiles
                        {
                            SolutionFile = new FileInfo
                            {
                                Filename = "filename",
                                Contents = "contents",
                            },
                            ReadOnlyFiles = new List<FileInfo>()
                            {
                                new FileInfo { Filename = "filename", Contents = "contents" },
                                new FileInfo { Filename = "filename", Contents = "contents" },
                            },
                        }
                    },
                },
                InputParams = new List<VariableTypeAndName>()
                {
                    new VariableTypeAndName
                    {
                        VariableType = new VariableType(new VariableType.IntegerType()),
                        Name = "name",
                    },
                    new VariableTypeAndName
                    {
                        VariableType = new VariableType(new VariableType.IntegerType()),
                        Name = "name",
                    },
                },
                OutputType = new VariableType(new VariableType.IntegerType()),
                Testcases = new List<TestCaseWithExpectedResult>()
                {
                    new TestCaseWithExpectedResult
                    {
                        TestCase = new TestCase
                        {
                            Id = "id",
                            Params = new List<VariableValue>()
                            {
                                new VariableValue(new VariableValue.IntegerValue(1)),
                                new VariableValue(new VariableValue.IntegerValue(1)),
                            },
                        },
                        ExpectedResult = new VariableValue(new VariableValue.IntegerValue(1)),
                    },
                    new TestCaseWithExpectedResult
                    {
                        TestCase = new TestCase
                        {
                            Id = "id",
                            Params = new List<VariableValue>()
                            {
                                new VariableValue(new VariableValue.IntegerValue(1)),
                                new VariableValue(new VariableValue.IntegerValue(1)),
                            },
                        },
                        ExpectedResult = new VariableValue(new VariableValue.IntegerValue(1)),
                    },
                },
                MethodName = "methodName",
            }
        );
        Assert.That(
            response,
            Is.EqualTo(JsonUtils.Deserialize<UpdateProblemResponse>(mockResponse)).UsingDefaults()
        );
    }
}
