package controller

import (
	"github.com/Lysander66/franky/app/internal/service"

	"github.com/gin-gonic/gin"
)

func SetRouter(g *gin.Engine) {
	api := g.Group("/api/v1")
	api.GET("crypto/md5", md5Hash)
	api.GET("crypto/sha1", sha1Hash)
	api.GET("crypto/sha256", sha256Hash)
	api.GET("crypto/sha512", sha512Hash)

	// WebSocket
	wsRouter := g.Group("/ws/v1")
	wsRouter.GET("echo", service.Echo)
}
