'use strict';

exports.BattleAbilities = {
	waggish: {
		id: "waggish",
		name: "Waggish",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority + 1;
			}
		},
		onModifyMove: function (move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.1;
			}
		},
		desc: "Status moves get +1 priority, Accuracy is boosted by 1.1x.",
	},
	poseidon: {
		id: "poseidon",
		name: "Poseidon",
		onStart: function (source) {
			this.setWeather('primordialsea');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'primordialsea' && !(weather.id in {
				desolateland: 1,
				primordialsea: 1,
				deltastream: 1,
			})) return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('primordialsea')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		onModifyMove: function (move) {
			if (!move || !move.flags['contact']) return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'par',
				ability: this.getAbility('poseidon'),
			});
		},
		desc: "On switch-in the user summons Heavy Rains, and moves without a chance to paralyze have a 30% chance to do so.",
	},
	server: {
		id: "server",
		name: "Server",
		onHit: function (target, source, move) {
			if (target !== source) {
				let stats = ['atk', 'def', 'spa', 'spd', 'spe'];
				this.add('-boost', target, stats[Math.floor(Math.random() * stats.length)], 1, '[from] ability: Server');
			}
		},
		onStart: function (target) {
			this.add('-start', target, 'ability: Server');
			this.add('raw', '<span style="font-family: monospace;">./spacialgaze>node app.js<br/>NEW GLOBAL: global<br/>NEW CHATROOM: lobby<br/>NEW CHATROOM: staff<br/>Worker 1 now listening on 0.0.0.0:8000<br/>Test your server at http://localhost:8000<br/>_</span>');
		},
		desc: "Randomly boosts the user's Attack, Defense, Special Attack, Special Defense, or Speed when the user successfully lands a move.",
		shortDesc: "When the user uses a move, one of its stats get a boost (except acc and eva).",
	},
	primalsurge: {
		name: 'Primal Surge',
		id: 'primalsurge',
		onStart: function (source) {
			this.setTerrain('electricterrain');
			this.terrainData.duration = 0;
		},
		onModifySpe: function (spe) {
			return this.chainModify(2);
		},
		onEnd: function (pokemon) {
			if (this.terrainData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('primalsurge')) {
						this.terrainData.source = target;
						return;
					}
				}
			}
			this.setTerrain('');
		},
		desc: "Permanent Electric Terrain, unless user switches out. Speed is doubled.",
	},
};
