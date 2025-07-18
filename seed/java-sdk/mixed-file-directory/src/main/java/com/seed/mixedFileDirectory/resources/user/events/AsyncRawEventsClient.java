/**
 * This file was auto-generated by Fern from our API Definition.
 */
package com.seed.mixedFileDirectory.resources.user.events;

import com.fasterxml.jackson.core.type.TypeReference;
import com.seed.mixedFileDirectory.core.ClientOptions;
import com.seed.mixedFileDirectory.core.ObjectMappers;
import com.seed.mixedFileDirectory.core.QueryStringMapper;
import com.seed.mixedFileDirectory.core.RequestOptions;
import com.seed.mixedFileDirectory.core.SeedMixedFileDirectoryApiException;
import com.seed.mixedFileDirectory.core.SeedMixedFileDirectoryException;
import com.seed.mixedFileDirectory.core.SeedMixedFileDirectoryHttpResponse;
import com.seed.mixedFileDirectory.resources.user.events.requests.ListUserEventsRequest;
import com.seed.mixedFileDirectory.resources.user.events.types.Event;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.jetbrains.annotations.NotNull;

public class AsyncRawEventsClient {
    protected final ClientOptions clientOptions;

    public AsyncRawEventsClient(ClientOptions clientOptions) {
        this.clientOptions = clientOptions;
    }

    /**
     * List all user events.
     */
    public CompletableFuture<SeedMixedFileDirectoryHttpResponse<List<Event>>> listEvents() {
        return listEvents(ListUserEventsRequest.builder().build());
    }

    /**
     * List all user events.
     */
    public CompletableFuture<SeedMixedFileDirectoryHttpResponse<List<Event>>> listEvents(
            ListUserEventsRequest request) {
        return listEvents(request, null);
    }

    /**
     * List all user events.
     */
    public CompletableFuture<SeedMixedFileDirectoryHttpResponse<List<Event>>> listEvents(
            ListUserEventsRequest request, RequestOptions requestOptions) {
        HttpUrl.Builder httpUrl = HttpUrl.parse(this.clientOptions.environment().getUrl())
                .newBuilder()
                .addPathSegments("users/events");
        if (request.getLimit().isPresent()) {
            QueryStringMapper.addQueryParameter(
                    httpUrl, "limit", request.getLimit().get(), false);
        }
        Request.Builder _requestBuilder = new Request.Builder()
                .url(httpUrl.build())
                .method("GET", null)
                .headers(Headers.of(clientOptions.headers(requestOptions)))
                .addHeader("Accept", "application/json");
        Request okhttpRequest = _requestBuilder.build();
        OkHttpClient client = clientOptions.httpClient();
        if (requestOptions != null && requestOptions.getTimeout().isPresent()) {
            client = clientOptions.httpClientWithTimeout(requestOptions);
        }
        CompletableFuture<SeedMixedFileDirectoryHttpResponse<List<Event>>> future = new CompletableFuture<>();
        client.newCall(okhttpRequest).enqueue(new Callback() {
            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                try (ResponseBody responseBody = response.body()) {
                    if (response.isSuccessful()) {
                        future.complete(new SeedMixedFileDirectoryHttpResponse<>(
                                ObjectMappers.JSON_MAPPER.readValue(
                                        responseBody.string(), new TypeReference<List<Event>>() {}),
                                response));
                        return;
                    }
                    String responseBodyString = responseBody != null ? responseBody.string() : "{}";
                    future.completeExceptionally(new SeedMixedFileDirectoryApiException(
                            "Error with status code " + response.code(),
                            response.code(),
                            ObjectMappers.JSON_MAPPER.readValue(responseBodyString, Object.class),
                            response));
                    return;
                } catch (IOException e) {
                    future.completeExceptionally(
                            new SeedMixedFileDirectoryException("Network error executing HTTP request", e));
                }
            }

            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                future.completeExceptionally(
                        new SeedMixedFileDirectoryException("Network error executing HTTP request", e));
            }
        });
        return future;
    }
}
