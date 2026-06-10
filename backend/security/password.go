package security

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func VerifyPassword(stored, candidate string) (bool, error) {
	if IsPasswordHash(stored) {
		err := bcrypt.CompareHashAndPassword([]byte(stored), []byte(candidate))
		if err == bcrypt.ErrMismatchedHashAndPassword {
			return false, nil
		}
		return err == nil, err
	}

	return subtle.ConstantTimeCompare([]byte(stored), []byte(candidate)) == 1, nil
}

func IsPasswordHash(value string) bool {
	return strings.HasPrefix(value, "$2a$") ||
		strings.HasPrefix(value, "$2b$") ||
		strings.HasPrefix(value, "$2y$")
}

func RandomToken(size int) (string, error) {
	bytes := make([]byte, size)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(bytes), nil
}
