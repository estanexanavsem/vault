package security

import (
	"strings"
	"testing"
)

func TestHashAndVerifyPassword(t *testing.T) {
	hash, err := HashPassword("secret")
	if err != nil {
		t.Fatalf("hash password: %v", err)
	}
	if hash == "secret" {
		t.Fatal("hash should not equal plaintext password")
	}
	if !IsPasswordHash(hash) {
		t.Fatalf("expected bcrypt hash prefix, got %q", hash)
	}

	ok, err := VerifyPassword(hash, "secret")
	if err != nil {
		t.Fatalf("verify hashed password: %v", err)
	}
	if !ok {
		t.Fatal("expected hashed password to verify")
	}

	ok, err = VerifyPassword(hash, "wrong")
	if err != nil {
		t.Fatalf("verify mismatched password: %v", err)
	}
	if ok {
		t.Fatal("expected wrong password to fail")
	}
}

func TestVerifyPasswordSupportsPlaintextMigrationPath(t *testing.T) {
	ok, err := VerifyPassword("legacy-secret", "legacy-secret")
	if err != nil {
		t.Fatalf("verify legacy password: %v", err)
	}
	if !ok {
		t.Fatal("expected legacy plaintext password to verify")
	}

	ok, err = VerifyPassword("legacy-secret", "wrong")
	if err != nil {
		t.Fatalf("verify wrong legacy password: %v", err)
	}
	if ok {
		t.Fatal("expected wrong legacy password to fail")
	}
}

func TestIsPasswordHashRecognizesBcryptPrefixes(t *testing.T) {
	for _, value := range []string{"$2a$hash", "$2b$hash", "$2y$hash"} {
		if !IsPasswordHash(value) {
			t.Fatalf("expected %q to be recognized as bcrypt hash", value)
		}
	}
	if IsPasswordHash("plain") {
		t.Fatal("plaintext should not be recognized as bcrypt hash")
	}
}

func TestRandomTokenReturnsURLSafeToken(t *testing.T) {
	token, err := RandomToken(32)
	if err != nil {
		t.Fatalf("random token: %v", err)
	}
	if token == "" {
		t.Fatal("expected non-empty token")
	}
	if strings.ContainsAny(token, "+/=") {
		t.Fatalf("token is not raw URL-safe base64: %q", token)
	}

	other, err := RandomToken(32)
	if err != nil {
		t.Fatalf("second random token: %v", err)
	}
	if token == other {
		t.Fatal("expected two random tokens to differ")
	}
}
