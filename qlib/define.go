package qlib

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

var GlobalConfig *Config

type Config struct {
	Env      string
	ACLMode  string
	LogLevel Level
	Ant      *AntConfig
	Server   *ServerConfig
	Postgres *PostgresConfig
	Redis    *RedisOptions
}

type Level int8

const (
	DebugLevel Level = iota
	InfoLevel
	WarnLevel
	ErrorLevel
)

type AntConfig struct {
	ApiHost string
	WsHost  string
	Token   string
}

type ServerConfig struct {
	ApiAddr string
	WsAddr  string
}

type PostgresConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DbName   string
	SSLMode  string
	TimeZone string
	MaxIdle  int
	MaxOpen  int
	DSN      string
}

type RedisOptions struct {
	// host:port address.
	Addr               string
	Username           string
	Password           string
	DB                 int
	MaxRetries         int
	MinRetryBackoff    time.Duration
	MaxRetryBackoff    time.Duration
	DialTimeout        time.Duration
	ReadTimeout        time.Duration
	WriteTimeout       time.Duration
	PoolFIFO           bool
	PoolSize           int
	MinIdleConns       int
	MaxConnAge         time.Duration
	PoolTimeout        time.Duration
	IdleTimeout        time.Duration
	IdleCheckFrequency time.Duration
}

func ReadGlobalConfig(name string) *Config {
	viper.SetConfigName(name)
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %w", err))
	}

	GlobalConfig = &Config{}
	err = viper.Unmarshal(GlobalConfig)
	if err != nil {
		panic(err)
	}

	p := GlobalConfig.Postgres
	if p.MaxIdle <= 0 {
		p.MaxIdle = 5
	}
	if p.MaxOpen <= 0 {
		p.MaxOpen = 30
	}
	p.DSN = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=%s",
		p.Host, p.User, p.Password, p.DbName, p.Port, p.SSLMode, p.TimeZone)
	return GlobalConfig
}
