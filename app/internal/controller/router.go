package controller

import (
	"github.com/Lysander66/franky/app/internal/service"

	"github.com/gin-gonic/gin"
)

func SetRouter(g *gin.Engine) {
	//api := g.Group("/api/v1")

	// WebSocket
	wsRouter := g.Group("/ws/v1")
	wsRouter.GET("echo", service.Echo)
}