const alphaScale = {
    grass: 1/35,
    start_house: 1/150,
    woman_warior: 0.2,
    rock: 1/9,
    monster: 1/3,
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
        'punch' : '/assets/warrior/punch.glb',
        'death' : '/assets/warrior/death.glb',
        'walkback' : '/assets/warrior/walkback.glb',
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
        'punch': '/assets/monster/punch.glb',
        'kick': '/assets/monster/kick.glb',
        'defend': '/assets/monster/defend.glb',
        'death': '/assets/monster/death.glb',
        'walking': '/assets/monster/walking.glb',
        'scale': sc_arr(alphaScale.monster),
        'position': [1.0535467565403631, 0.0009999999999996698, 1.1560143062174264],
        'physicSize': [0.2, 0.5, 0.2],
    },
    'items' : {
        'bag': '/assets/items/bag.png',
        
    }

}