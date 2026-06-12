package security

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
)

// ErrInvalidSessionToken reports a malformed or incorrectly signed session token.
var ErrInvalidSessionToken = errors.New("invalid session token")

// SignedSessionToken returns a base64url JSON payload with an HMAC signature.
func SignedSessionToken(payload any, secret string) (string, error) {
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	encodedPayload := base64.RawURLEncoding.EncodeToString(payloadBytes)
	return encodedPayload + "." + SignSessionPayload(encodedPayload, secret), nil
}

// DecodeSignedSessionToken verifies token with secret and decodes its JSON payload.
func DecodeSignedSessionToken(token, secret string, payload any) error {
	encodedPayload, signature, ok := splitSessionToken(token)
	if !ok {
		return ErrInvalidSessionToken
	}
	if !hmac.Equal([]byte(signature), []byte(SignSessionPayload(encodedPayload, secret))) {
		return ErrInvalidSessionToken
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(encodedPayload)
	if err != nil {
		return err
	}
	return json.Unmarshal(payloadBytes, payload)
}

// DecodeSessionPayload decodes token's JSON payload without verifying its signature.
func DecodeSessionPayload(token string, payload any) error {
	encodedPayload, _, ok := splitSessionToken(token)
	if !ok {
		return ErrInvalidSessionToken
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(encodedPayload)
	if err != nil {
		return err
	}
	return json.Unmarshal(payloadBytes, payload)
}

// SignSessionPayload signs an already encoded session payload.
func SignSessionPayload(encodedPayload string, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(encodedPayload))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}

func splitSessionToken(token string) (string, string, bool) {
	parts := strings.Split(token, ".")
	if len(parts) != 2 {
		return "", "", false
	}
	return parts[0], parts[1], true
}
