import express from "express";
import {faker} from "@faker-js/faker";
import fetch from "node-fetch";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/characters", async (req, res) => {
    const response = await fetch("https://api.disneyapi.dev/character");
    const data = await response.json();

    //Disney API stores characters in data.data
    res.render("characters", { characters: data.data });
});

app.get("/movies", (req, res) => {
    res.render("movies");
});

app.get("/movies/results", async (req, res) => {
    const query = req.query.title;

    const response = await fetch(`https://api.disneyapi.dev/character?films=${query}`);
    const data = await response.json();

    const moviePoster = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Disney_logo.svg/320px-Disney_logo.svg.png";
    res.render("moviesResults", { characters: data.data, movieTitle: query, moviePoster });
});

app.get("/allies", async (req, res) => {
    let characterWithRelations = null;

    for (let i = 0; i < 10; i++) {
        const randomPage = Math.floor(Math.random() * 149) + 1;

        const pageResponse = await fetch(`https://api.disneyapi.dev/character?page=${randomPage}`);
        const pageData = await pageResponse.json();

        const characters = pageData.data;

        const validCharacters = characters.filter(c =>
            (c.allies && c.allies.length > 0) ||
            (c.enemies && c.enemies.length > 0)
        );

        if (validCharacters.length > 0) {
                characterWithRelations = validCharacters[Math.floor(Math.random() * validCharacters.length)];
                break;
            }
        }

        if(!characterWithRelations) {
            return res.render("alliesResults", { characterData: null });
        }
        res.render("alliesResults", { characterData: characterWithRelations });

});

app.get("/funfacts", (req, res) => {
    const funFacts = [
        "Mickey Mouse was the first animated character to receive a star on the Hollywood Walk of Fame.",
        "Walt Disney was fired from a newspaper for 'lacking imagination and having no good ideas.'",
        "The first full-length animated feature film was Disney's 'Snow White and the Seven Dwarfs' released in 1937.",
        "Disneyland in California is the only theme park that Walt Disney personally supervised.",
        "The voice of Mickey Mouse, Walt Disney himself, also provided the voice for Mickey's dog, Pluto."
    ];

    //Randomize fun facts
    const funFact = funFacts[Math.floor(Math.random() * funFacts.length)];

    res.render("funfacts", { funFact });
});

app.listen(3000, () => {
    console.log("server started");
});

