package cache

import (
	"context"
	"github.com/Lysander66/franky/app/manifest/config"

	"github.com/redis/go-redis/v9"
)

var (
	rdb *redis.Client
)

func GetRedisClient() *redis.Client {
	return rdb
}

func Init(ctx context.Context, opt *config.RedisOptions) {
	client := redis.NewClient(&redis.Options{
		Addr:        opt.Addr,
		Password:    opt.Password,
		DB:          opt.DB,
		DialTimeout: opt.DialTimeout,
		PoolSize:    opt.PoolSize,
	})
	if err := client.Ping(ctx).Err(); err != nil {
		panic(err)
	}
	rdb = client
}
