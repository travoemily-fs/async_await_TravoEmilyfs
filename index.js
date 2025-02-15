// imports
require("dotenv").config();

// pokemon API link
const API_URL = process.env.POKEMON_API_URL;

// getPokemonData function
// specify in the async function that we are grabbing pokemons by their ID
const getPokemonData = async (id) => {
  // try & catch for errors
  try {
    // first API call gets basic pokemon info
    // follow the url pattern from API documentation and call for the ID
    const response = await fetch(`${API_URL}${id}`);
    // handle response errors by checking if response is valid
    if (!response.ok)
      throw new Error(
        `A HTTP error was encountered. Response status: ${response.status}`
      );
    // variable for the returned pokemon + data as json
    const pokemon = await response.json();

    // parsing data for types using the map() array method
    // use join() to separate array items with a comma
    const types = pokemon.types.map((t) => t.type.name).join(", ");

    // second API call gets details that are specific to the fetched pokemon
    // first API request returns a species key w/ a url so we have to look toward that URL for the additional species information
    const detailResponse = await fetch(pokemon.species.url);
    if (!detailResponse.ok)
      throw new Error(
        `A HTTP error was encountered. Response status: ${detailResponse.status}`
      );

    // variable for the returned pokemon species data as json
    const speciesData = await detailResponse.json();

    // fetches flavor text
    // the first flavor text entry is the english response, so we have to specifically target it
    const flavorTextEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    // ternary operator to quick hand if/else statement ... '?' is the if, ':' is the else
    const flavorText = flavorTextEntry
      ? flavorTextEntry.flavor_text.replace(/\s+/g, " ").trim() // ensure single spacing between entries
      : "No flavor text available for returned Pokemon.";

    // fetches habit name
    // checks for habitat name and return response for no habitat entry
    const habitat = speciesData.habitat ? speciesData.habitat.name : "Unknown";

    // boolean check to see if pokemon is legendary
    const isLegendary = speciesData.is_legendary;

    // return data in a table so its nice and neat!
    console.table({
      Name: pokemon.name,
      Height: pokemon.height,
      Weight: pokemon.weight,
      Types: types,
      // adjust data if its too long to fit in the table
      "Flavor Text":
        flavorText.length > 50 ? flavorText.slice(0, 50) + "..." : flavorText,
      Habitat: habitat,
      Legendary: isLegendary,
    });

    // list out data to be returned
    return {
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      types,
      flavorText,
      habitat,
      isLegendary,
    };
  } catch (error) {
    console.error(
      "Oops! There was an error processing your request to the Pokemon API:",
      error.message
    );
  }
};

// assignmentTask function to generate random pokemon ID
const assignmentTask = async () => {
  const randomPokemon = Math.floor(Math.random() * 151) + 1; // add 1 bc JS starts at 0
  console.log(`Fetching data from Pokemon ID: ${randomPokemon}`);
  await getPokemonData(randomPokemon);
};

// run the task
assignmentTask();
