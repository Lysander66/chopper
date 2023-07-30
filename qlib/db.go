package qlib

import (
	"context"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func GormOpen(conf *PostgresConfig) *gorm.DB {
	logConfig := logger.New(log.New(os.Stdout, "\r\n", log.LstdFlags), logger.Config{
		SlowThreshold:             time.Second,
		Colorful:                  true,
		IgnoreRecordNotFoundError: true,
		LogLevel:                  logger.Error,
	})
	db, err := gorm.Open(postgres.Open(conf.DSN), &gorm.Config{Logger: logConfig})
	if err != nil {
		panic(err)
	}

	sqlDB, err := db.DB()
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

	return db
}
