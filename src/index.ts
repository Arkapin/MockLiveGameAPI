import process from "process";
import express from "express";
import https from "https";
import fs from "fs";
import path from 'path';

import { LiveGame } from "./live_game";
import { DDragon } from "./ddragon";
import fetch from "node-fetch";

const appRoot = path.resolve(__dirname, "../");
const privateKey = fs.readFileSync(path.resolve(appRoot, 'server/key.pem')).toString();
const certificate = fs.readFileSync(path.resolve(appRoot, 'server/cert.pem')).toString();
const app = express();
const keyRegex = /(RGAPI-)?[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/ig;

let port = 2999;
let locale = "en_US";
let apiKey = "";
let region = "euw1";
let matchId = 4665685331;
let verbose = false;
let gameSpeed = 1;

let playerList = [
	{
		"championName": "Darius",
		"isBot": false,
		"isDead": false,
		"items": [],
		"level": 1,
		"position": "",
		"rawChampionName": "game_character_displayname_Darius",
		"rawSkinName": "game_character_skin_displayname_Darius_15",
		"respawnTimer": 0.0,
		"runes": {
			"keystone": {
				"displayName": "Conqueror",
				"id": 8010,
				"rawDescription": "perk_tooltip_Conqueror",
				"rawDisplayName": "perk_displayname_Conqueror"
			},
			"primaryRuneTree": {
				"displayName": "Precision",
				"id": 8000,
				"rawDescription": "perkstyle_tooltip_7201",
				"rawDisplayName": "perkstyle_displayname_7201"
			},
			"secondaryRuneTree": {
				"displayName": "Resolve",
				"id": 8400,
				"rawDescription": "perkstyle_tooltip_7204",
				"rawDisplayName": "perkstyle_displayname_7204"
			}
		},
		"scores": {
			"assists": 0,
			"creepScore": 0,
			"deaths": 0,
			"kills": 0,
			"wardScore": 0.0
		},
		"skinID": 15,
		"skinName": "God-King Darius",
		"summonerName": "Arkapin",
		"summonerSpells": {
			"summonerSpellOne": {
				"displayName": "Ghost",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerHaste_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerHaste_DisplayName"
			},
			"summonerSpellTwo": {
				"displayName": "Flash",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerFlash_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerFlash_DisplayName"
			}
		},
		"team": "ORDER"
	},
	{
		"championName": "Brand",
		"isBot": true,
		"isDead": false,
		"items": [
			{
				"canUse": false,
				"consumable": false,
				"count": 1,
				"displayName": "Spellthief's Edge",
				"itemID": 3850,
				"price": 400,
				"rawDescription": "GeneratedTip_Item_3850_Description",
				"rawDisplayName": "Item_3850_Name",
				"slot": 0
			},
			{
				"canUse": true,
				"consumable": true,
				"count": 2,
				"displayName": "Health Potion",
				"itemID": 2003,
				"price": 50,
				"rawDescription": "GeneratedTip_Item_2003_Description",
				"rawDisplayName": "Item_2003_Name",
				"slot": 1
			},
			{
				"canUse": true,
				"consumable": false,
				"count": 1,
				"displayName": "Stealth Ward",
				"itemID": 3340,
				"price": 0,
				"rawDescription": "GeneratedTip_Item_3340_Description",
				"rawDisplayName": "Item_3340_Name",
				"slot": 6
			}
		],
		"level": 2,
		"position": "",
		"rawChampionName": "game_character_displayname_Brand",
		"respawnTimer": 0.0,
		"runes": {
			"keystone": {
				"displayName": "Arcane Comet",
				"id": 8229,
				"rawDescription": "perk_tooltip_ArcaneComet",
				"rawDisplayName": "perk_displayname_ArcaneComet"
			},
			"primaryRuneTree": {
				"displayName": "Sorcery",
				"id": 8200,
				"rawDescription": "perkstyle_tooltip_7202",
				"rawDisplayName": "perkstyle_displayname_7202"
			},
			"secondaryRuneTree": {
				"displayName": "Domination",
				"id": 8100,
				"rawDescription": "perkstyle_tooltip_7200",
				"rawDisplayName": "perkstyle_displayname_7200"
			}
		},
		"scores": {
			"assists": 0,
			"creepScore": 0,
			"deaths": 0,
			"kills": 0,
			"wardScore": 0.0
		},
		"skinID": 0,
		"summonerName": "Brand Bot",
		"summonerSpells": {
			"summonerSpellOne": {
				"displayName": "Ignite",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerDot_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerDot_DisplayName"
			},
			"summonerSpellTwo": {
				"displayName": "Exhaust",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerExhaust_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerExhaust_DisplayName"
			}
		},
		"team": "CHAOS"
	},
	{
		"championName": "Galio",
		"isBot": true,
		"isDead": false,
		"items": [
			{
				"canUse": false,
				"consumable": false,
				"count": 1,
				"displayName": "Dark Seal",
				"itemID": 1082,
				"price": 350,
				"rawDescription": "GeneratedTip_Item_1082_Description",
				"rawDisplayName": "Item_1082_Name",
				"slot": 0
			},
			{
				"canUse": true,
				"consumable": true,
				"count": 3,
				"displayName": "Health Potion",
				"itemID": 2003,
				"price": 50,
				"rawDescription": "GeneratedTip_Item_2003_Description",
				"rawDisplayName": "Item_2003_Name",
				"slot": 1
			},
			{
				"canUse": true,
				"consumable": false,
				"count": 1,
				"displayName": "Stealth Ward",
				"itemID": 3340,
				"price": 0,
				"rawDescription": "GeneratedTip_Item_3340_Description",
				"rawDisplayName": "Item_3340_Name",
				"slot": 6
			}
		],
		"level": 2,
		"position": "",
		"rawChampionName": "game_character_displayname_Galio",
		"respawnTimer": 0.0,
		"runes": {
			"keystone": {
				"displayName": "Grasp of the Undying",
				"id": 8437,
				"rawDescription": "perk_tooltip_GraspOfTheUndying",
				"rawDisplayName": "perk_displayname_GraspOfTheUndying"
			},
			"primaryRuneTree": {
				"displayName": "Resolve",
				"id": 8400,
				"rawDescription": "perkstyle_tooltip_7204",
				"rawDisplayName": "perkstyle_displayname_7204"
			},
			"secondaryRuneTree": {
				"displayName": "Sorcery",
				"id": 8200,
				"rawDescription": "perkstyle_tooltip_7202",
				"rawDisplayName": "perkstyle_displayname_7202"
			}
		},
		"scores": {
			"assists": 0,
			"creepScore": 0,
			"deaths": 0,
			"kills": 0,
			"wardScore": 0.0
		},
		"skinID": 0,
		"summonerName": "Galio Bot",
		"summonerSpells": {
			"summonerSpellOne": {
				"displayName": "Ghost",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerHaste_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerHaste_DisplayName"
			},
			"summonerSpellTwo": {
				"displayName": "Heal",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerHeal_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerHeal_DisplayName"
			}
		},
		"team": "CHAOS"
	},
	{
		"championName": "Shyvana",
		"isBot": true,
		"isDead": false,
		"items": [
			{
				"canUse": false,
				"consumable": false,
				"count": 1,
				"displayName": "Doran's Blade",
				"itemID": 1055,
				"price": 450,
				"rawDescription": "GeneratedTip_Item_1055_Description",
				"rawDisplayName": "Item_1055_Name",
				"slot": 0
			},
			{
				"canUse": true,
				"consumable": true,
				"count": 1,
				"displayName": "Health Potion",
				"itemID": 2003,
				"price": 50,
				"rawDescription": "GeneratedTip_Item_2003_Description",
				"rawDisplayName": "Item_2003_Name",
				"slot": 1
			},
			{
				"canUse": true,
				"consumable": false,
				"count": 1,
				"displayName": "Stealth Ward",
				"itemID": 3340,
				"price": 0,
				"rawDescription": "GeneratedTip_Item_3340_Description",
				"rawDisplayName": "Item_3340_Name",
				"slot": 6
			}
		],
		"level": 3,
		"position": "",
		"rawChampionName": "game_character_displayname_Shyvana",
		"respawnTimer": 0.0,
		"runes": {
			"keystone": {
				"displayName": "Grasp of the Undying",
				"id": 8437,
				"rawDescription": "perk_tooltip_GraspOfTheUndying",
				"rawDisplayName": "perk_displayname_GraspOfTheUndying"
			},
			"primaryRuneTree": {
				"displayName": "Resolve",
				"id": 8400,
				"rawDescription": "perkstyle_tooltip_7204",
				"rawDisplayName": "perkstyle_displayname_7204"
			},
			"secondaryRuneTree": {
				"displayName": "Sorcery",
				"id": 8200,
				"rawDescription": "perkstyle_tooltip_7202",
				"rawDisplayName": "perkstyle_displayname_7202"
			}
		},
		"scores": {
			"assists": 0,
			"creepScore": 10,
			"deaths": 0,
			"kills": 0,
			"wardScore": 0.0
		},
		"skinID": 0,
		"summonerName": "Shyvana Bot",
		"summonerSpells": {
			"summonerSpellOne": {
				"displayName": "Exhaust",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerExhaust_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerExhaust_DisplayName"
			},
			"summonerSpellTwo": {
				"displayName": "Ghost",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerHaste_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerHaste_DisplayName"
			}
		},
		"team": "CHAOS"
	},
	{
		"championName": "Sivir",
		"isBot": true,
		"isDead": false,
		"items": [
			{
				"canUse": false,
				"consumable": false,
				"count": 1,
				"displayName": "Long Sword",
				"itemID": 1036,
				"price": 350,
				"rawDescription": "GeneratedTip_Item_1036_Description",
				"rawDisplayName": "Item_1036_Name",
				"slot": 0
			},
			{
				"canUse": true,
				"consumable": true,
				"count": 3,
				"displayName": "Health Potion",
				"itemID": 2003,
				"price": 50,
				"rawDescription": "GeneratedTip_Item_2003_Description",
				"rawDisplayName": "Item_2003_Name",
				"slot": 1
			},
			{
				"canUse": true,
				"consumable": false,
				"count": 1,
				"displayName": "Stealth Ward",
				"itemID": 3340,
				"price": 0,
				"rawDescription": "GeneratedTip_Item_3340_Description",
				"rawDisplayName": "Item_3340_Name",
				"slot": 6
			}
		],
		"level": 2,
		"position": "",
		"rawChampionName": "game_character_displayname_Sivir",
		"respawnTimer": 0.0,
		"runes": {
			"keystone": {
				"displayName": "Press the Attack",
				"id": 8005,
				"rawDescription": "perk_tooltip_PressTheAttack",
				"rawDisplayName": "perk_displayname_PressTheAttack"
			},
			"primaryRuneTree": {
				"displayName": "Precision",
				"id": 8000,
				"rawDescription": "perkstyle_tooltip_7201",
				"rawDisplayName": "perkstyle_displayname_7201"
			},
			"secondaryRuneTree": {
				"displayName": "Sorcery",
				"id": 8200,
				"rawDescription": "perkstyle_tooltip_7202",
				"rawDisplayName": "perkstyle_displayname_7202"
			}
		},
		"scores": {
			"assists": 0,
			"creepScore": 0,
			"deaths": 0,
			"kills": 0,
			"wardScore": 0.0
		},
		"skinID": 0,
		"summonerName": "Sivir Bot",
		"summonerSpells": {
			"summonerSpellOne": {
				"displayName": "Ignite",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerDot_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerDot_DisplayName"
			},
			"summonerSpellTwo": {
				"displayName": "Exhaust",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerExhaust_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerExhaust_DisplayName"
			}
		},
		"team": "CHAOS"
	},
	{
		"championName": "Alistar",
		"isBot": true,
		"isDead": false,
		"items": [
			{
				"canUse": false,
				"consumable": false,
				"count": 1,
				"displayName": "Steel Shoulderguards",
				"itemID": 3854,
				"price": 400,
				"rawDescription": "GeneratedTip_Item_3854_Description",
				"rawDisplayName": "Item_3854_Name",
				"slot": 0
			},
			{
				"canUse": true,
				"consumable": true,
				"count": 2,
				"displayName": "Health Potion",
				"itemID": 2003,
				"price": 50,
				"rawDescription": "GeneratedTip_Item_2003_Description",
				"rawDisplayName": "Item_2003_Name",
				"slot": 1
			},
			{
				"canUse": true,
				"consumable": false,
				"count": 1,
				"displayName": "Stealth Ward",
				"itemID": 3340,
				"price": 0,
				"rawDescription": "GeneratedTip_Item_3340_Description",
				"rawDisplayName": "Item_3340_Name",
				"slot": 6
			}
		],
		"level": 2,
		"position": "",
		"rawChampionName": "game_character_displayname_Alistar",
		"respawnTimer": 0.0,
		"runes": {
			"keystone": {
				"displayName": "Grasp of the Undying",
				"id": 8437,
				"rawDescription": "perk_tooltip_GraspOfTheUndying",
				"rawDisplayName": "perk_displayname_GraspOfTheUndying"
			},
			"primaryRuneTree": {
				"displayName": "Resolve",
				"id": 8400,
				"rawDescription": "perkstyle_tooltip_7204",
				"rawDisplayName": "perkstyle_displayname_7204"
			},
			"secondaryRuneTree": {
				"displayName": "Sorcery",
				"id": 8200,
				"rawDescription": "perkstyle_tooltip_7202",
				"rawDisplayName": "perkstyle_displayname_7202"
			}
		},
		"scores": {
			"assists": 0,
			"creepScore": 0,
			"deaths": 0,
			"kills": 0,
			"wardScore": 0.0
		},
		"skinID": 0,
		"summonerName": "Alistar Bot",
		"summonerSpells": {
			"summonerSpellOne": {
				"displayName": "Heal",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerHeal_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerHeal_DisplayName"
			},
			"summonerSpellTwo": {
				"displayName": "Exhaust",
				"rawDescription": "GeneratedTip_SummonerSpell_SummonerExhaust_Description",
				"rawDisplayName": "GeneratedTip_SummonerSpell_SummonerExhaust_DisplayName"
			}
		},
		"team": "CHAOS"
	}
];

function validateKey(): boolean {
	try {
		// Check if the argument is a key
		if (keyRegex.test(apiKey))
			return true;

		// Is it an env variable?
		let newKey = process.env[apiKey];
		if (newKey && keyRegex.test(newKey)) {
			apiKey = newKey;
			return true;
		}

		// is it a file?
		newKey = fs.existsSync(apiKey) ? fs.readFileSync(apiKey).toString() : undefined;
		if (newKey && keyRegex.test(newKey)) {
			apiKey = newKey;
			return true;
		}

		return false;
	}
	catch (e) {
		console.error(`Exception occurred trying to evaluate key argument '${apiKey}': ${e}`);
		return false;
	}
}

(async function() {
	console.log("Parsing arguments");
	// Parse arguments

	let i = 2;

	console.log(process.argv);

	for (; i < process.argv.length; i++) {
		switch (process.argv[i]) {
			case "-port":
			case "-p": {
				port = parseInt(process.argv[++i]);
				break;
			}

			case "-locale":
			case "-l": {
				locale = process.argv[++i];

				const localeRequest = await fetch("https://ddragon.leagueoflegends.com/cdn/languages.json");
				if (!localeRequest.ok)
					throw "Request for locale types from DDragon has failed!";
				const locales = <string[]>await localeRequest.json();
				if (locales.indexOf(locale) < 0)
					throw `'${locale}' is not a valid locale. Needs to be one of the following: ${locales.join(", ")}`;
				break;
			}

			case "-region":
			case "-r": {
				region = process.argv[++i];
				break;
			}

			case "-apikey":
			case "-k": {
				apiKey = process.argv[++i];
				break;
			}

			case "-match":
			case "-m": {
				matchId = parseInt(process.argv[++i]);
				break;
			}

			case "-gamespeed":
			case "-s": {
				gameSpeed = parseFloat(process.argv[++i])
				break;
			}

			case "-verbose":
			case "-v": {
				verbose = true;
				break;
			}
		}
	}

	let matchData: any = null;
	let timelineData: any = null;
	if (fs.existsSync(path.resolve(appRoot, "match.json")) && fs.existsSync(path.resolve(appRoot, "timeline.json"))) {
		console.log(`Found existing local match data..`);
		matchData = JSON.parse(fs.readFileSync(path.resolve(appRoot, "match.json")).toString());
		timelineData = JSON.parse(fs.readFileSync(path.resolve(appRoot, "timeline.json")).toString());
	}

	if (validateKey()) {
		console.log(`Downloading game data for ${matchId} (${region})..`);
		const matchRequest = await fetch(`https://${region}.api.riotgames.com/lol/match/v4/matches/${matchId}?api_key=${apiKey}`);
		if (!matchRequest.ok && matchData == null) {
			throw `Could not fetch "/lol/match/v4/matches/${matchId}" (region '${region}'), request returned ${matchRequest.status} ${matchRequest.statusText}`;
		}
		else if (matchRequest.ok) {
			const matchText = await matchRequest.text();
			fs.writeFileSync(path.resolve(appRoot, "match.json"), matchText);
			matchData = JSON.parse(matchText);
			console.log("Downloaded match");
		}

		const timelineRequest = await fetch(`https://${region}.api.riotgames.com/lol/match/v4/timelines/by-match/${matchId}?api_key=${apiKey}`);
		if (!timelineRequest.ok && timelineData == null) {
			throw `Could not fetch "/lol/match/v4/timelines/by-match/${matchId}" (region '${region}'), request returned ${timelineRequest.status} ${timelineRequest.statusText}`;
		}
		else if (timelineRequest.ok) {
			const matchText = await timelineRequest.text();
			fs.writeFileSync(path.resolve(appRoot, "timeline.json"), matchText);
			timelineData = JSON.parse(matchText);
			console.log("Downloaded timeline");
		}
	}

	let game = new LiveGame();
	await game.startGame({ match: matchData, timeline: timelineData, locale, verbose, speedMultiplier: gameSpeed });

	if (verbose) {
		setInterval(() => {
			game.update();
		}, 1000);
	}

	console.log("Initialising server");
	app.get('/liveclientdata/allgamedata', function (req, res) {
		game.isRunning ? res.send(game.allData) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/activeplayer', function (req, res) {
		game.isRunning ? res.send(game.activePlayer) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/activeplayername', function (req, res) {
		game.isRunning ? res.send(game.activePlayerName) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/activeplayerabilities', function (req, res) {
		game.isRunning ? res.send(game.activePlayerAbilities) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/activeplayerrunes', function (req, res) {
		game.isRunning ? res.send(game.activePlayerRunes) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/eventdata', function (req, res) {
		game.isRunning ? res.send(game.events) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/gamestats', function (req, res) {
		game.isRunning ? res.send(game.stats) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/playerlist', function (req, res) {
		game.isRunning ? res.jsonp(playerList) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/playerscores', function (req, res) {
		const queryName = req.query["summonerName"];
		const summonerName = typeof queryName === 'string' ? queryName : undefined;
		game.isRunning ? res.send(game.getPlayerScore(summonerName)) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/playersummonerspells', function (req, res) {
		const queryName = req.query["summonerName"];
		const summonerName = typeof queryName === 'string' ? queryName : undefined;
		game.isRunning ? res.send(game.getPlayerSummoners(summonerName)) : res.status(500).send("No game running");
	});
	
	app.get('/liveclientdata/playermainrunes', function (req, res) {
		const queryName = req.query["summonerName"];
		const summonerName = typeof queryName === 'string' ? queryName : undefined;
		game.isRunning ? res.send(game.activePlayerRunes) : res.status(500).send("No game running");
	});

	app.get('/liveclientdata/playeritems', function (req, res) {
		const queryName = req.query["summonerName"];
		const summonerName = typeof queryName === 'string' ? queryName : undefined;
		game.isRunning ? res.send(game.getPlayerItems(summonerName)) : res.status(500).send("No game running");
	});

	app.use(express.static('public'));

	https.createServer({ key: privateKey, cert: certificate }, app).listen(port, () => {
		console.log(`Mock Live Game API started at https://localhost:${port}`);
	});
})();
