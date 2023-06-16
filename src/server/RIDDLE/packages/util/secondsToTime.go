package util

import (
	"fmt"
)

func SecondsToTime(seconds int64) (string, error) {
	if seconds < 0 {
		return "", fmt.Errorf("el valor no puede ser negativo")
	}

	hours := seconds / 3600
	minutes := (seconds % 3600) / 60
	seconds = seconds % 60

	timeString := fmt.Sprintf("%02d:%02d:%02d", hours, minutes, seconds)
	return timeString, nil
}
