package main

import (
	"regexp"
	"strings"
)

func filter_string_by_delimiter(s string, delimiter string) []string {
	split_string := strings.Split(s, delimiter)
	if len(split_string) == 1 {
		return []string{}
	}
	return split_string[1 : len(split_string)-1]
}

func validate_split_string(s []string) string {
	if len(s) == 0 {
		return ""
	}
	return s[0]
}

func filter_string_by_regex(s string, regex *regexp.Regexp) string {
	filtered_string := regex.FindAllStringSubmatch(s, -1)
	if len(filtered_string) == 0 {
		return ""
	}
	return filtered_string[0][1]
}

func purge_string(s string, to_cut string) string {
	return strings.ReplaceAll(s, to_cut, "")
}
