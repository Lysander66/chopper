package main

import (
	"time"

	"github.com/Lysander66/franky/qlib"
	"gorm.io/gorm"
)

type Activity string

const (
	Reading                   Activity = "阅读"
	Sport                     Activity = "运动"
	Running                   Activity = "跑步"
	Cycling                   Activity = "骑自行车"
	SitUp                     Activity = "仰卧起坐"
	PullUp                    Activity = "引体向上"
	PushUp                    Activity = "俯卧撑"
	SideLateralRaise          Activity = "侧平举"
	DumbbellInclineBenchPress Activity = "哑铃上斜卧推"
	DumbbellRow               Activity = "哑铃划船"
	Crunch                    Activity = "卷腹"
	Squat                     Activity = "深蹲"
)

type LogbookArgs struct {
	Date        string
	Activity    Activity
	DurationMin int
	Value       float32
	Description string
}

type Logbook struct {
	Id          int
	Date        time.Time `gorm:"type:date;uniqueIndex:uk_1"`
	Activity    Activity  `gorm:"not null;uniqueIndex:uk_1"`
	DurationMin int
	Value       float32 `sql:"type:decimal(8,4)"`
	Description string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (t *Logbook) TableName() string {
	return "logbook"
}

var (
	db *gorm.DB
)

func initDB() {
	cfg := &qlib.PostgresConfig{
		MaxIdle: 5,
		MaxOpen: 30,
		DSN:     "host=localhost user=postgres password=example dbname=cruise port=5432 sslmode=disable TimeZone=Asia/Shanghai",
	}
	db = qlib.GormOpen(cfg)

	db.AutoMigrate(&Logbook{})
}
