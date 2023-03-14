package controller

import (
	"github.com/Lysander66/franky/qlib/util"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func add() {
	var t = time.Now()
	t.Unix()
	t.UnixMilli()
	time.UnixMilli().Format()
	time.Unix().Format()
}

// -------------------------*------------------------- crypto -------------------------#-------------------------

func md5Hash(c *gin.Context) {
	SucceedResp(c, util.MD5Hash(c.Query("s")))
}

func sha1Hash(c *gin.Context) {
	SucceedResp(c, util.SHA1Hash(c.Query("s")))
}

func sha256Hash(c *gin.Context) {
	SucceedResp(c, util.SHA256Hash(c.Query("s")))
}

func sha512Hash(c *gin.Context) {
	SucceedResp(c, util.SHA512Hash(c.Query("s")))
}

// -------------------------*------------------------- response -------------------------#-------------------------

type ApiData struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
	Msg  string      `json:"msg"`
}

type ApiListData struct {
	List  interface{} `json:"list"`
	Total int64       `json:"total"`
}

func SucceedResp(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, ApiData{Data: data})
}

func ErrorResp(c *gin.Context, err error) {
	ErrorCodeResp(c, -1, err)
}

func ErrorCodeResp(c *gin.Context, code int, err error) {
	c.JSON(http.StatusOK, ApiData{Code: code, Msg: err.Error()})
}
