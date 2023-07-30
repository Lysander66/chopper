package qlib

import (
	"context"

	"github.com/redis/go-redis/v9"
)

func NewClient(opt *RedisOptions) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:        opt.Addr,
		Password:    opt.Password,
		DB:          opt.DB,
		DialTimeout: opt.DialTimeout,
		PoolSize:    opt.PoolSize,
	})
	if err := client.Ping(context.Background()).Err(); err != nil {
		panic(err)
	}

	return client
}
