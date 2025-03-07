# Innordle

Currently only supports running in development mode. No packages or dependencies besides React and
Node.js required, to run, use:
```
npm run dev
```

## TODO:
### Functionality (Listed in order of importance):

- Add ability to reset game

- Add some way to apply settings before starting game

Includes Difficulty, and could also include which columns to include
Difficulty can be a strict include 

- Add options to change guessed characters

This includes whether the characters are randomly picked or by choice or daily. Would probably require some sort of backend!

- Rework search functionality to be faster and correct -> complete

Ideally we can have little profile photos next to each search entry to make it clearer. Also, the search is for "names containing letter x" instead of "names beginning with letter x". Should also speed up search somehow (maybe cache search results before loading the inputbox?)

- Add a submit button

This shouldn't be that hard, we just need an image for the button. The framework for the functionality is already there

- Figure out website hosting

We can just host on GitHub, but not sure how to attatch any backend functionality to it. Could remove all backend if we just keep everything local (including character of the day selection!)

- Refactor code

Right now a lot of the logic for what the squares display and changing what they look like is handled inside `Guesses.tsx`. It might be cleaner and more "React-like" if we move the logic into `Game.tsx`. This is also a placeholder for other potential ways we can make the codebase cleaner.

- Add hints

This involves hand-creating hints for each of the characters, which I'm not sure we're gonna do. We could just not include some of the categories and include them as hints!

- Remove hints

This involves hand-deleting hints for each of the characters, which we're not gonna do. 


- Add spoiler mode

This would just hide the category of whether the character is dead or alive

- Make it so that empty boxes are "Unknown"

Duuuuuuuh

- Add more modes!

Longshot. Shoot for the stars!

### Appearance (Listed in order of importance):
- Add logo -> Complete
- Add background to arrows
- Do something about the profile pictures
- Add victory screen
- Change font size when box is too small -> Complete
- Add tooltips on hover
- Create transparent textures for behind squares
- Make search bar look nicer / remove autofill
- Add favicon
- Find a better font
- Create stylized shading for background image 
- Style scrollbars to be more immersive

