package exec

import (
	"regexp"
	"strings"
)

func findForbiddenFunctions(code string, forbiddenFuncs []string) []string {
	// Turning slice into map for constant lookups
	forbiddenSet := make(map[string]bool)
	for _, f := range forbiddenFuncs {
		forbiddenSet[f] = true
	}

	// Regex to match function calls
	funcRegex := regexp.MustCompile(`\b([a-zA-Z_][a-zA-Z0-9_]*)\(`)
	matches := funcRegex.FindAllStringSubmatch(code, -1)

	// Get all forbidden functions that were found
	foundFuncs := make(map[string]bool)
	for _, match := range matches {
		funcName := strings.TrimSpace(match[1])
		if forbiddenSet[funcName] {
			foundFuncs[funcName] = true
		}
	}

	// Transform map into slice to return it
	result := make([]string, 0, len(foundFuncs))
	for funcName := range foundFuncs {
		result = append(result, funcName)
	}
	return result
}

func addOutput(output, expected string, input []string, result *Result, shown bool) {
	if shown {
		var test map[string]interface{} = make(map[string]interface{})
		test["expected"] = expected
		test["got"] = output
		test["input"] = strings.Join(input, ", ")

		if output == expected {
			test["passed"] = true
			result.ShownPassed++
		} else if output != expected {
			test["passed"] = false
			result.Passed = false
			result.ShownFailed++
		}
		result.ShownTests = append(result.ShownTests, test)
	} else {
		if output == expected {
			result.HiddenTests["passed"]++
		} else {
			result.HiddenTests["failed"]++
			result.Passed = false
		}
	}
}
