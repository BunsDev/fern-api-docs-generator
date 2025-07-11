/**
 * This file was auto-generated by Fern from our API Definition.
 */
package com.seed.publicObject.resources.service;

import com.seed.publicObject.core.ClientOptions;
import com.seed.publicObject.core.ObjectMappers;
import com.seed.publicObject.core.RequestOptions;
import com.seed.publicObject.core.ResponseBodyInputStream;
import com.seed.publicObject.core.SeedPublicObjectApiException;
import com.seed.publicObject.core.SeedPublicObjectException;
import com.seed.publicObject.core.SeedPublicObjectHttpResponse;
import java.io.IOException;
import java.io.InputStream;
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

public class AsyncRawServiceClient {
    protected final ClientOptions clientOptions;

    public AsyncRawServiceClient(ClientOptions clientOptions) {
        this.clientOptions = clientOptions;
    }

    public CompletableFuture<SeedPublicObjectHttpResponse<InputStream>> get() {
        return get(null);
    }

    public CompletableFuture<SeedPublicObjectHttpResponse<InputStream>> get(RequestOptions requestOptions) {
        HttpUrl httpUrl = HttpUrl.parse(this.clientOptions.environment().getUrl())
                .newBuilder()
                .addPathSegments("helloworld.txt")
                .build();
        Request okhttpRequest = new Request.Builder()
                .url(httpUrl)
                .method("GET", null)
                .headers(Headers.of(clientOptions.headers(requestOptions)))
                .build();
        OkHttpClient client = clientOptions.httpClient();
        if (requestOptions != null && requestOptions.getTimeout().isPresent()) {
            client = clientOptions.httpClientWithTimeout(requestOptions);
        }
        CompletableFuture<SeedPublicObjectHttpResponse<InputStream>> future = new CompletableFuture<>();
        client.newCall(okhttpRequest).enqueue(new Callback() {
            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                try {
                    ResponseBody responseBody = response.body();
                    if (response.isSuccessful()) {
                        future.complete(
                                new SeedPublicObjectHttpResponse<>(new ResponseBodyInputStream(response), response));
                        return;
                    }
                    String responseBodyString = responseBody != null ? responseBody.string() : "{}";
                    future.completeExceptionally(new SeedPublicObjectApiException(
                            "Error with status code " + response.code(),
                            response.code(),
                            ObjectMappers.JSON_MAPPER.readValue(responseBodyString, Object.class),
                            response));
                    return;
                } catch (IOException e) {
                    future.completeExceptionally(
                            new SeedPublicObjectException("Network error executing HTTP request", e));
                }
            }

            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                future.completeExceptionally(new SeedPublicObjectException("Network error executing HTTP request", e));
            }
        });
        return future;
    }
}
