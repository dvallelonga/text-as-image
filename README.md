# text-as-image
An experimental project to explore the rendering of text as an image.

**Input:** 1) any text file and 2) any image file

**Output:** the input text re-arranged (whitespace removed) and colored as the pixels of the input image.

## Example

### Input text file:
```
Lorem ipsum dolor sit amet, consectetur
adipiscing elit.
Donec id dui eget augue venenatis commodo. Aenean sagittis lacus
sed libero tincidunt fermentum.
...[truncated]
```

### Input image file:

![source-image](https://user-images.githubusercontent.com/1099585/134207890-6f14ec54-0f31-4b50-84c1-5eac762fa5ec.png)


### Output (zoomed and cropped for demonstration):

![image](https://user-images.githubusercontent.com/1099585/134231813-813760d5-cdd5-4249-b877-3e5ba358ba47.png)


## Dev

### Tech Stack

- Backend: Node.js (TypeScript)
- Tests: Jest

### Dev Commands

All dev commands are defined in the package.json `scripts` block. The most notable being:

- Build source code: `npm run build`
- Run server: `npm start`
- Run automated tests: `npm test`


