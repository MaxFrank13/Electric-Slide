# Platformer-game
A platformer game built using canvas

## Description

Welcome to Electric Slide! This is a simple platformer game built using vanilla JavaScript. You are the green box and your goal is to glide as much as possible. The more you glide, the more points you rack up! Gliding on higher rails will award extra points. You can earn a points multiplier that increases the longer you stay off the ground and remain sliding. 

[Electric Slide](https://maxfrank13.github.io/Electric-Slide/)

![Photo of Electric Slide menu](https://github.com/MaxFrank13/Electric-Slide/blob/main/assets/Electric-Slide.jpg)

### Canvas API

The Canvas API combined with the use of `requestAnimationFrame`  provide a way to produce complex animations in the web browser. This game is simply an interactive animation built on an HTML `<canvas>` element. The position of objects is dictated by the user's input. 

### Classes & OOP

Classes provide the structure that the animation relies on in order to know precisely where to position game objects. User inputs modify properties of each game object between renders of the page. Because renders happen so quickly, the illusion of movement is achieved and users are given control of the animation.