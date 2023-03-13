package cmd

import (
	"context"
	"github.com/Lysander66/franky/app/internal/controller"
	"github.com/Lysander66/franky/app/internal/task"
	"github.com/Lysander66/franky/qlib/logger"
	assets "github.com/Lysander66/franky/sunny"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
)

func Run() {
	logger.InitZeroLog("app", zerolog.InfoLevel)
	l := logger.Get()

	go task.RunLoop()

	// frontend
	go serveStatic()

	g := gin.New()
	pprof.Register(g)
	g.Use(cors.Default())
	gin.SetMode(gin.ReleaseMode)
	g.Use(gin.Logger(), gin.Recovery())

	g.ForwardedByClientIP = true
	controller.SetRouter(g)

	srv := &http.Server{Addr: ":8180", Handler: g}
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			l.Fatal().Err(err).Msg("ListenAndServe")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	l.Debug().Msg("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		l.Fatal().Err(err).Msg("Server forced to shutdown")
	}
	l.Info().Msg("Server exiting")
}

func serveStatic() {
	r := gin.Default()
	//r.Static("/", "build")
	r.StaticFS("/", assets.FS())
	r.Run(":8080")
}
