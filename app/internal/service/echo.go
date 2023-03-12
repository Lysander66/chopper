package service

import (
	"github.com/Lysander66/franky/qlib/logger"
	"github.com/Lysander66/franky/qlib/ws"
	"github.com/gin-gonic/gin"
)

var hub = ws.NewHub()

func Echo(c *gin.Context) {
	var (
		l      = logger.Get()
		header = c.Request.Header
		ip     = header.Get("X-Forwarded-For")
	)
	if header.Get("Cdn-Loop") == "cloudflare" {
		ip = header.Get("Cf-Connecting-Ip")
		l.Debug().Str("X-Forwarded-For", header.Get("X-Forwarded-For")).Str("Cf-Connecting-Ip", ip).Msg("ClientIP")
	}

	ws.ServeWs(c.Writer, c.Request, hub)
}
