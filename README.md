<h1>Prezzo</h1>

Prezzo is a text-based presentation creator that leverages a Markdown-like notation style to cut creation time to a minimum and saving nerves in the process. The design engine automatically adjusts the design of your slides to craft a modern and minimalistic presentation, so you can focus only on your story.

---

<h3>Origins</h3>

The motivation was to be able to be able to just type out the content I want to see in a presentation and not have to worry about the design. I wanted a tool to take in content (images, text, what have you) and generate a slide deck that is ready to go.

---

<h3>How to create presentations</h3>


Prezzo is tailored towards those familiar with Markdown. The syntax is very similar to Markdown, with a few differences. Here is an example of a simple presentation:

```
---

# Title #

~ Content ~

/assets/image.png

---
```

Slides are separated by `---`. The title of the slide is denoted by `# Title #`. The content of the slide is denoted by `~ Content ~`. Images can be added by using `/assets/image.png`.

While the design engine will try to adjust the design of the slides to make them look good, you can also add custom CSS to the slides. This can be done by adding various style directives to the slide. Here is an example:

```
---
background-color: #42484d;
text-color: #FFFFFF;
font-face: Arial;

# Title #

~ Content ~

/assets/image.png

---
```

Alternatively, if you would like to apply styling to the entire slide deck, you can add the following to the top of the presentation (not within a slide):
```
background-color-all: #42484d;
text-color-all: #FFFFFF;
font-face-all: Arial;
```

---

<i>Developed and maintained by Farzan Mirshekari</i>
