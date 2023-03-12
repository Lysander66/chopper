package ws

import (
	"github.com/Lysander66/franky/qlib/logger"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/websocket"
)

const reconnectInterval = 2 * time.Second

type MsgHandleFunc func(msg []byte)

type SimpleWsClientParam struct {
	Url        string
	HandleFunc MsgHandleFunc
}

type SimpleWsClient struct {
	token     string
	reconnect chan SimpleWsClientParam
}

func NewSimpleWsClient(token string) *SimpleWsClient {
	l := logger.Get()
	s := &SimpleWsClient{
		token:     token,
		reconnect: make(chan SimpleWsClientParam, 1),
	}
	go func() {
		for {
			select {
			case param := <-s.reconnect:
				l.Info().Str("url", param.Url).Msg("reconnect")
				go s.connect(param)
			}
		}
	}()
	return s
}

func (s SimpleWsClient) Subscribe(params ...SimpleWsClientParam) {
	for _, param := range params {
		go s.connect(param)
	}
}

func (s SimpleWsClient) connect(param SimpleWsClientParam) {
	l := logger.Get()
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, syscall.SIGINT, syscall.SIGTERM)

	url := param.Url
	c, _, err := websocket.DefaultDialer.Dial(url, http.Header{"token": []string{s.token}})
	if err != nil {
		l.Err(err).Str("url", url).Msg("connect fail.")
		s.reconnect <- param
		return
	}
	defer c.Close()
	l.Info().Str("url", url).Msg("connect success!")

	done := make(chan struct{})
	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				l.Err(err).Str("url", url).Msg("disconnect")
				time.Sleep(reconnectInterval)
				s.reconnect <- param
				return
			}
			param.HandleFunc(message)
		}
	}()

	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			err = c.WriteMessage(websocket.PingMessage, nil)
			if err != nil {
				l.Err(err).Msg("WriteMessage")
				return
			}
		case <-interrupt:
			err = c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				l.Err(err).Msg("interrupt")
				return
			}
			select {
			case <-done:
			case <-time.After(time.Second):
			}
			return
		}
	}
}
