// Code generated by Fern. DO NOT EDIT.

package packageyml

import (
	context "context"
	core "github.com/package-yml/fern/core"
	internal "github.com/package-yml/fern/internal"
	option "github.com/package-yml/fern/option"
	http "net/http"
)

type Acme struct {
	baseURL string
	caller  *internal.Caller
	header  http.Header

	WithRawResponse *RawAcme
	Service         *ServiceClient
}

func New(opts ...option.RequestOption) *Acme {
	options := core.NewRequestOptions(opts...)
	return &Acme{
		baseURL: options.BaseURL,
		caller: internal.NewCaller(
			&internal.CallerParams{
				Client:      options.HTTPClient,
				MaxAttempts: options.MaxAttempts,
			},
		),
		header:          options.ToHeader(),
		WithRawResponse: NewRawAcme(options),
		Service:         NewServiceClient(opts...),
	}
}

func (a *Acme) Echo(
	ctx context.Context,
	id string,
	request *EchoRequest,
	opts ...option.RequestOption,
) (string, error) {
	options := core.NewRequestOptions(opts...)
	baseURL := internal.ResolveBaseURL(
		options.BaseURL,
		a.baseURL,
		"",
	)
	endpointURL := internal.EncodeURL(
		baseURL+"/%v/",
		id,
	)
	headers := internal.MergeHeaders(
		a.header.Clone(),
		options.ToHeader(),
	)

	var response string
	if _, err := a.caller.Call(
		ctx,
		&internal.CallParams{
			URL:             endpointURL,
			Method:          http.MethodPost,
			Headers:         headers,
			MaxAttempts:     options.MaxAttempts,
			BodyProperties:  options.BodyProperties,
			QueryParameters: options.QueryParameters,
			Client:          options.HTTPClient,
			Request:         request,
			Response:        &response,
		},
	); err != nil {
		return "", err
	}
	return response, nil
}
