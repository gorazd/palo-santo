/**
* Eleventy Configuration
*/
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

// imports here
export default function (eleventyConfig) {
  // We will add our configuration here
  eleventyConfig.addPlugin(EleventyVitePlugin);
  
  // Add passthrough copy for JavaScript files
  eleventyConfig.addPassthroughCopy("content/**/*.js");
};

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk, *.html, *.liquid
  templateFormats: [
    "md",
    "njk",
    "html",
    "liquid",
    "11ty.js",
  ],

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: "njk",

  // Pre-process *.html files with: (default: `liquid`)
  htmlTemplateEngine: "njk",

  // These are all optional:
  dir: {
    input: "content",          // default: "."
    includes: "../_includes",  // default: "_includes" (`input` relative)
    data: "../_data",          // default: "_data" (`input` relative)
    output: "_site"
  },
};
