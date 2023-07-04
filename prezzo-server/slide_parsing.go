package main

import (
	"fmt"
	"image/color"
	"regexp"
	"strings"

	"github.com/muesli/gamut"
)

func get_text_colors(presentation_content raw_content, slides_count int) []string {
	text_color_regex := regexp.MustCompile(`text-color-all:\s*(.*?)\s*;`)
	text_color := filter_string_by_regex(presentation_content.Text_Content, text_color_regex)
	if text_color == "" {
		text_color = "#ffffff"
	}
	text_colors := make([]string, slides_count)
	for i := range text_colors {
		text_colors[i] = text_color
	}
	return text_colors
}

func get_background_colors(presentation_content raw_content, slides_count int) []color.Color {
	background_color_scheme_regex := regexp.MustCompile(`background-color-all:\s*(.*?)\s*;`)
	color_scheme := filter_string_by_regex(presentation_content.Text_Content, background_color_scheme_regex)
	if color_scheme == "" {
		color_scheme = "#111236"
	}
	color_scheme_split := strings.Split(color_scheme, " ")
	if len(color_scheme_split) < 2 {
		color_scheme_split = append(color_scheme_split, "")
	}
	color_scheme_color := color_scheme_split[0]
	color_scheme_progression := color_scheme_split[1]
	if color_scheme_progression == "tint" {
		return gamut.Tints(gamut.Hex(color_scheme_color), slides_count*2)
	} else if color_scheme_progression == "shade" {
		return gamut.Shades(gamut.Hex(color_scheme_color), slides_count*2)
	} else if color_scheme_progression == "tone" {
		return gamut.Tones(gamut.Hex(color_scheme_color), slides_count*2)
	} else {
		return func() []color.Color {
			colors := make([]color.Color, slides_count*2)
			for i := range colors {
				colors[i] = gamut.Hex(color_scheme_color)
			}
			return colors
		}()
	}
}

func get_font_faces(presentation_content raw_content, slides_count int) []string {
	font_face_regex := regexp.MustCompile(`font-face-all:\s*(.*?)\s*;`)
	font_face := filter_string_by_regex(presentation_content.Text_Content, font_face_regex)
	if font_face == "" {
		font_face = "Arial"
	}
	font_faces := make([]string, slides_count)
	for i := range font_faces {
		font_faces[i] = font_face
	}
	return font_faces
}

func get_slide_text_color(slide *string, default_color string) string {
	text_color_regex := regexp.MustCompile(`text-color:\s*(.*?)\s*;`)
	text_color := filter_string_by_regex(strings.Replace(*slide, "text-color: ", "text-color:", 1), text_color_regex)
	if text_color == "" {
		return default_color
	} else {
		*slide = purge_string(*slide, fmt.Sprintf("text-color: %s;", text_color))
		return text_color
	}
}

func get_slide_background_color(slide *string, default_color color.Color) color.Color {
	slide_background_color_regex := regexp.MustCompile(`background-color:\s*(.*?)\s*;`)
	slide_background_color := filter_string_by_regex(strings.Replace(*slide, "background-color: ", "background-color:", 1), slide_background_color_regex)
	if slide_background_color == "" {
		return default_color
	} else {
		*slide = purge_string(*slide, fmt.Sprintf("background-color: %s;", slide_background_color))
		return gamut.Hex(slide_background_color)
	}
}

func get_slide_font_face(slide *string, default_font_face string) string {
	slide_font_face_regex := regexp.MustCompile(`font-face:\s*(.*?)\s*;`)
	slide_font_face := filter_string_by_regex(strings.Replace(*slide, "font-face: ", "font-face:", 1), slide_font_face_regex)
	if slide_font_face == "" {
		return default_font_face
	} else {
		*slide = purge_string(*slide, fmt.Sprintf("font-face: %s;", slide_font_face))
		return slide_font_face
	}
}
