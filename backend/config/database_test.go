package config

import (
	"path/filepath"
	"testing"

	"vault/models"
	"vault/security"
)

func TestInitDBCreatesSchemaAndHashesEnvPanelPassword(t *testing.T) {
	t.Setenv("PANEL_PASSWORD", "panel-secret")

	dbPath := filepath.Join(t.TempDir(), "vault.db")
	if err := InitDB(dbPath); err != nil {
		t.Fatalf("init db: %v", err)
	}

	if DB == nil {
		t.Fatal("expected global DB to be initialized")
	}
	for _, table := range []any{&models.Account{}, &models.Transfer{}, &models.File{}, &models.Settings{}} {
		if !DB.Migrator().HasTable(table) {
			t.Fatalf("expected table for %T", table)
		}
	}

	var setting models.Settings
	if err := DB.Where("key = ?", "panel_password").First(&setting).Error; err != nil {
		t.Fatalf("load panel setting: %v", err)
	}
	if setting.Value == "panel-secret" || !security.IsPasswordHash(setting.Value) {
		t.Fatalf("panel password was not hashed: %q", setting.Value)
	}
	ok, err := security.VerifyPassword(setting.Value, "panel-secret")
	if err != nil {
		t.Fatalf("verify panel password: %v", err)
	}
	if !ok {
		t.Fatal("panel password hash does not match env value")
	}
}

func TestEnsurePanelPasswordKeepsHashAndMigratesPlaintext(t *testing.T) {
	t.Setenv("PANEL_PASSWORD", "initial-secret")

	dbPath := filepath.Join(t.TempDir(), "vault.db")
	if err := InitDB(dbPath); err != nil {
		t.Fatalf("init db: %v", err)
	}

	var setting models.Settings
	if err := DB.Where("key = ?", "panel_password").First(&setting).Error; err != nil {
		t.Fatalf("load hashed setting: %v", err)
	}
	originalHash := setting.Value
	if err := ensurePanelPassword(); err != nil {
		t.Fatalf("ensure existing hash: %v", err)
	}
	if err := DB.Where("key = ?", "panel_password").First(&setting).Error; err != nil {
		t.Fatalf("reload hashed setting: %v", err)
	}
	if setting.Value != originalHash {
		t.Fatal("existing hash should not be changed")
	}

	setting.Value = "legacy-secret"
	if err := DB.Save(&setting).Error; err != nil {
		t.Fatalf("save plaintext setting: %v", err)
	}
	if err := ensurePanelPassword(); err != nil {
		t.Fatalf("migrate plaintext setting: %v", err)
	}
	if err := DB.Where("key = ?", "panel_password").First(&setting).Error; err != nil {
		t.Fatalf("reload migrated setting: %v", err)
	}
	if setting.Value == "legacy-secret" || !security.IsPasswordHash(setting.Value) {
		t.Fatalf("plaintext setting was not migrated: %q", setting.Value)
	}
	ok, err := security.VerifyPassword(setting.Value, "legacy-secret")
	if err != nil {
		t.Fatalf("verify migrated setting: %v", err)
	}
	if !ok {
		t.Fatal("migrated setting hash does not match legacy value")
	}
}
