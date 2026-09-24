package helper

const (
	RequestIdKey = "X-Oneapi-Request-Id"
)

type contextKey string

const requestIDContextKey contextKey = RequestIdKey
