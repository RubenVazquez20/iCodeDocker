package util




// Returns true if the answer(s) is correct
func GradeMultiChoice(correctOptions []string, givenAnswers []string) bool {
	for _, answer := range givenAnswers {
		if !Contains(correctOptions, answer) {
			return false
		}
	}
	return (len(givenAnswers) != 0)
}