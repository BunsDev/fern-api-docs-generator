/**
 * This file was auto-generated by Fern from our API Definition.
 */
package com.seed._enum.resources.queryparam;

import com.seed._enum.core.ClientOptions;
import com.seed._enum.core.ObjectMappers;
import com.seed._enum.core.QueryStringMapper;
import com.seed._enum.core.RequestOptions;
import com.seed._enum.core.SeedEnumApiException;
import com.seed._enum.core.SeedEnumException;
import com.seed._enum.core.SeedEnumHttpResponse;
import com.seed._enum.resources.queryparam.requests.SendEnumAsQueryParamRequest;
import com.seed._enum.resources.queryparam.requests.SendEnumListAsQueryParamRequest;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.jetbrains.annotations.NotNull;

public class AsyncRawQueryParamClient {
    protected final ClientOptions clientOptions;

    public AsyncRawQueryParamClient(ClientOptions clientOptions) {
        this.clientOptions = clientOptions;
    }

    public CompletableFuture<SeedEnumHttpResponse<Void>> send(SendEnumAsQueryParamRequest request) {
        return send(request, null);
    }

    public CompletableFuture<SeedEnumHttpResponse<Void>> send(
            SendEnumAsQueryParamRequest request, RequestOptions requestOptions) {
        HttpUrl.Builder httpUrl = HttpUrl.parse(this.clientOptions.environment().getUrl())
                .newBuilder()
                .addPathSegments("query");
        QueryStringMapper.addQueryParameter(httpUrl, "operand", request.getOperand(), false);
        if (request.getMaybeOperand().isPresent()) {
            QueryStringMapper.addQueryParameter(
                    httpUrl, "maybeOperand", request.getMaybeOperand().get(), false);
        }
        QueryStringMapper.addQueryParameter(httpUrl, "operandOrColor", request.getOperandOrColor(), false);
        if (request.getMaybeOperandOrColor().isPresent()) {
            QueryStringMapper.addQueryParameter(
                    httpUrl,
                    "maybeOperandOrColor",
                    request.getMaybeOperandOrColor().get(),
                    false);
        }
        Request.Builder _requestBuilder = new Request.Builder()
                .url(httpUrl.build())
                .method("POST", RequestBody.create("", null))
                .headers(Headers.of(clientOptions.headers(requestOptions)));
        Request okhttpRequest = _requestBuilder.build();
        OkHttpClient client = clientOptions.httpClient();
        if (requestOptions != null && requestOptions.getTimeout().isPresent()) {
            client = clientOptions.httpClientWithTimeout(requestOptions);
        }
        CompletableFuture<SeedEnumHttpResponse<Void>> future = new CompletableFuture<>();
        client.newCall(okhttpRequest).enqueue(new Callback() {
            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                try (ResponseBody responseBody = response.body()) {
                    if (response.isSuccessful()) {
                        future.complete(new SeedEnumHttpResponse<>(null, response));
                        return;
                    }
                    String responseBodyString = responseBody != null ? responseBody.string() : "{}";
                    future.completeExceptionally(new SeedEnumApiException(
                            "Error with status code " + response.code(),
                            response.code(),
                            ObjectMappers.JSON_MAPPER.readValue(responseBodyString, Object.class),
                            response));
                    return;
                } catch (IOException e) {
                    future.completeExceptionally(new SeedEnumException("Network error executing HTTP request", e));
                }
            }

            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                future.completeExceptionally(new SeedEnumException("Network error executing HTTP request", e));
            }
        });
        return future;
    }

    public CompletableFuture<SeedEnumHttpResponse<Void>> sendList(SendEnumListAsQueryParamRequest request) {
        return sendList(request, null);
    }

    public CompletableFuture<SeedEnumHttpResponse<Void>> sendList(
            SendEnumListAsQueryParamRequest request, RequestOptions requestOptions) {
        HttpUrl.Builder httpUrl = HttpUrl.parse(this.clientOptions.environment().getUrl())
                .newBuilder()
                .addPathSegments("query-list");
        QueryStringMapper.addQueryParameter(httpUrl, "operand", request.getOperand(), true);
        if (request.getMaybeOperand().isPresent()) {
            QueryStringMapper.addQueryParameter(
                    httpUrl, "maybeOperand", request.getMaybeOperand().get(), true);
        }
        QueryStringMapper.addQueryParameter(httpUrl, "operandOrColor", request.getOperandOrColor(), true);
        if (request.getMaybeOperandOrColor().isPresent()) {
            QueryStringMapper.addQueryParameter(
                    httpUrl,
                    "maybeOperandOrColor",
                    request.getMaybeOperandOrColor().get(),
                    true);
        }
        Request.Builder _requestBuilder = new Request.Builder()
                .url(httpUrl.build())
                .method("POST", RequestBody.create("", null))
                .headers(Headers.of(clientOptions.headers(requestOptions)));
        Request okhttpRequest = _requestBuilder.build();
        OkHttpClient client = clientOptions.httpClient();
        if (requestOptions != null && requestOptions.getTimeout().isPresent()) {
            client = clientOptions.httpClientWithTimeout(requestOptions);
        }
        CompletableFuture<SeedEnumHttpResponse<Void>> future = new CompletableFuture<>();
        client.newCall(okhttpRequest).enqueue(new Callback() {
            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                try (ResponseBody responseBody = response.body()) {
                    if (response.isSuccessful()) {
                        future.complete(new SeedEnumHttpResponse<>(null, response));
                        return;
                    }
                    String responseBodyString = responseBody != null ? responseBody.string() : "{}";
                    future.completeExceptionally(new SeedEnumApiException(
                            "Error with status code " + response.code(),
                            response.code(),
                            ObjectMappers.JSON_MAPPER.readValue(responseBodyString, Object.class),
                            response));
                    return;
                } catch (IOException e) {
                    future.completeExceptionally(new SeedEnumException("Network error executing HTTP request", e));
                }
            }

            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                future.completeExceptionally(new SeedEnumException("Network error executing HTTP request", e));
            }
        });
        return future;
    }
}
