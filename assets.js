const alphaScale = {
    grass: 1/35,
    start_house: 1/150,
    woman_warior: 0.2,
    rock: 1/9,
    monster: 1/3,
    magic_circle: 4/10,
    joan: 3/10,
    arena: 1/10,
}

function sc_arr(scale) {
    return [scale, scale, scale];
}

export const MODELS = {
    'grass' : {
        'model': '/assets/grass/grass.glb',
        'scale' : [alphaScale.grass,alphaScale.grass,alphaScale.grass],
    },
    'trail': {
        'url': '/assets/trail/images.png'
    },
    'bluesky': {
        'url' : '/assets/bluesky/skybox-png-5.png'
    },
    'ground': {
        'url': '/assets/ground/ground_texture.png'
    },
    'tree': {
        'model': '/assets/tree/stylized_tree.glb'
    },
    'woman_warior': {
        'model' : '/assets/warrior/model.glb',
        'idle' : '/assets/warrior/idle.glb',
        'run' : '/assets/warrior/run.glb',
        'normalskill' : '/assets/warrior/punch.glb',
        'death' : '/assets/warrior/death.glb',
        'walkback' : '/assets/warrior/walkback.glb',
        'sweepfall' : '/assets/warrior/sweepfall.glb',
        'scale' : sc_arr(alphaScale.woman_warior),
        'position': [5,0,0],
        'physicSize': [0.1, 0.5, 0.1],
        'avatar': '/assets/warrior/avatar.png',
    },
    'rock': {
        'model' : '/assets/rock/stylized_rock.glb',
        'scale' : sc_arr(alphaScale.rock),
    },
    'start_house': {
        'model': '/assets/start_house/fantasy_house.glb',
        'scale': sc_arr(alphaScale.start_house),
        'position': [0.48351250483810504, 0.0157151875747152, -2.1921407062389227],
    },
    'monster' : {
        'model': '/assets/monster/model.glb',
        'idle': '/assets/monster/idle.glb',
        'normalskill': '/assets/monster/punch.glb',
        'kick': '/assets/monster/kick.glb',
        'defend': '/assets/monster/defend.glb',
        'death': '/assets/monster/death.glb',
        'walking': '/assets/monster/walking.glb',
        'scale': sc_arr(alphaScale.monster),
        'position': [3.6832196515472893, 0, -5.8610014157611925],
        'physicSize': [0.2, 0.5, 0.2],
    },
    'items' : {
        'bag': '/assets/items/bag.png',
    },
    'magic_circle': {
        'fire': '/assets/magic_circle/fire_cirle.glb',
        'scale': sc_arr(alphaScale.magic_circle),
        'position': [0,1,0],
    },
    'music' : {
        'fantasy_world' : '/assets/music/fantasyworld.mp3',
    },
    'npc1' : {
        'url' : '/assets/Joan/joan.glb',
        'position' : [0.3833148552944432,0,-1.335972254454855],
        'scale' : sc_arr(alphaScale.joan),
    },
    'arena' : {
        'url' : '/assets/arena/arena.glb',
        'position' : [3.6832196515472893, 0, -5.8610014157611925],
        'scale' : sc_arr(alphaScale.arena),
    },
}