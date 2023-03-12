package assets

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed build
var dist embed.FS

func FS() http.FileSystem {
	stripped, err := fs.Sub(dist, "build")
	if err != nil {
		panic(err)
	}
	return http.FS(stripped)
}
