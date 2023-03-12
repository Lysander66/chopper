package logger

import (
	"io"
	"os"
	"time"

	"github.com/rs/zerolog"
	"gopkg.in/natefinch/lumberjack.v2"
)

var log zerolog.Logger

func Get() zerolog.Logger {
	return log
}

func InitZeroLog(serviceName string, logLevel zerolog.Level) {
	//zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack
	zerolog.TimeFieldFormat = time.RFC3339Nano

	var w io.Writer = zerolog.ConsoleWriter{
		Out:        os.Stdout,
		NoColor:    false,
		TimeFormat: time.RFC3339,
		PartsOrder: []string{
			zerolog.TimestampFieldName,
			zerolog.LevelFieldName,
			zerolog.CallerFieldName,
			zerolog.MessageFieldName,
		},
	}

	if os.Getenv("ENVIRON") == "release" {
		dir := "/opt/log/" + serviceName
		if _, err1 := os.Stat(dir); os.IsNotExist(err1) {
			if err := os.MkdirAll(dir, 0777); err != nil {
				panic(err)
			}
		}
		fileLogger := &lumberjack.Logger{
			Filename: dir + "/json.log",
			MaxSize:  10,
			//MaxBackups: 10,
			MaxAge:   60,
			Compress: false,
		}
		w = zerolog.MultiLevelWriter(os.Stderr, fileLogger)
	}

	log = zerolog.New(w).Level(logLevel).With().Timestamp().Caller().Logger()
}
