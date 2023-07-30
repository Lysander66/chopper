package main

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/Lysander66/franky/qlib/logger"
	"github.com/olekukonko/tablewriter"
	"github.com/rs/zerolog"
)

const layout = "2006-01-02"

func main() {
	logger.InitZeroLog("", zerolog.InfoLevel)

	var list []*Logbook
	list = etl()

	//initDB()
	//for _, item := range list {
	//	db.Create(item)
	//}
	//err := db.Model(&Logbook{}).Order("date desc, activity").Find(&list).Error
	//if err != nil {
	//	l.Err(err).Send()
	//	return
	//}

	var dates []time.Time
	var m = make(map[time.Time][]*Logbook)
	for _, v := range list {
		if _, ok := m[v.Date]; !ok {
			dates = append(dates, v.Date)
		}
		m[v.Date] = append(m[v.Date], v)
	}

	for _, date := range dates {
		var rows [][]string
		for _, v := range m[date] {
			r := []string{string(v.Activity), strconv.Itoa(v.DurationMin)}
			if v.Activity == Running || v.Activity == Cycling {
				r = append(r, fmt.Sprintf("%.2f", v.Value))
			} else {
				r = append(r, fmt.Sprintf("%.0f", v.Value))
			}
			r = append(r, v.Description)
			rows = append(rows, r)
		}
		caption := fmt.Sprintf("%s %s", date.Format(layout), date.Weekday())
		fmt.Println(render(caption, rows))
	}
}

func render(caption string, rows [][]string) string {
	writer := &strings.Builder{}
	table := tablewriter.NewWriter(writer)
	table.SetHeader([]string{"Activity", "Duration", "Value", "Description"})
	table.SetBorder(false)
	table.SetCaption(true, caption)

	table.SetColumnColor(
		tablewriter.Colors{tablewriter.FgBlueColor},
		tablewriter.Colors{tablewriter.FgYellowColor},
		tablewriter.Colors{tablewriter.FgHiRedColor},
		tablewriter.Colors{tablewriter.FgGreenColor},
	)

	table.AppendBulk(rows)
	table.Render()
	return writer.String()
}

func etl() (list []*Logbook) {
	years := [][]*LogbookArgs{
		Y2023,
	}

	l := logger.Get()
	for _, year := range years {
		for _, v := range year {
			date, err := time.Parse(layout, v.Date)
			if err != nil {
				l.Err(err).Str("date", v.Date).Send()
				return
			}
			item := &Logbook{
				Date:        date,
				Activity:    v.Activity,
				DurationMin: v.DurationMin,
				Value:       v.Value,
				Description: v.Description,
			}
			list = append(list, item)
		}
	}
	return
}
