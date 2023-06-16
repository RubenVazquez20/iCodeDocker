package util

// Function to check if a slice contains a value
func Contains(s []string, val string) bool {
	for _, sliceVal := range s {
		if sliceVal == val {
			return true
		}
	}

	return false
}