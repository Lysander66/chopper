package model

import (
	"context"
	"github.com/Lysander66/franky/app/manifest/config"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

func Init(conf *config.PostgresConfig) {
	logConfig := logger.New(log.New(os.Stdout, "\r\n", log.LstdFlags), logger.Config{
		SlowThreshold:             time.Second,
		Colorful:                  true,
		IgnoreRecordNotFoundError: true,
		LogLevel:                  logger.Error,
	})
	DB, err := gorm.Open(postgres.Open(conf.DSN), &gorm.Config{Logger: logConfig})
	if err != nil {
		panic(err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		panic(err)
	}
	sqlDB.SetMaxIdleConns(conf.MaxIdle)
	sqlDB.SetMaxOpenConns(conf.MaxOpen)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	err = sqlDB.PingContext(ctx)
	if err != nil {
		panic(err)
	}

	db = DB
}
