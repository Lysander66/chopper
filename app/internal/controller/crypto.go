package controller

import (
	"crypto"
	"encoding/base64"
	"github.com/Lysander66/franky/qlib/logger"
	"github.com/Lysander66/franky/qlib/util"
	"github.com/gin-gonic/gin"
	"github.com/gogf/gf/v2/util/gconv"
	"net/http"
)

func encode(c *gin.Context) {
	var (
		algorithm = c.Query("algorithm")
		s         = c.Query("s")
		output    string
	)

	if gconv.Int64(c.Param("time")) == 0 {
		//TODO
	}
	switch algorithm {
	case "Base64":
		output = base64.StdEncoding.EncodeToString([]byte(s))
	case crypto.MD5.String():
		output = util.Md5Hash(s)
	default:
	}

	SucceedResp(c, output)
}

func decode(c *gin.Context) {
	var (
		l         = logger.Get()
		algorithm = c.Query("algorithm")
		s         = c.Query("s")
		output    string
	)

	switch algorithm {
	case "Base64":
		data, err := base64.StdEncoding.DecodeString(s)
		if err != nil {
			ErrorResp(c, err)
			l.Err(err).Str("s", s).Msg("DecodeString")
			return
		}
		output = string(data)
	default:
	}

	SucceedResp(c, output)
}

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
