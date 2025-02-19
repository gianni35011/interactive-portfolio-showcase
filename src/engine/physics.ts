import Rapier from '@dimforge/rapier3d-compat'

async function initPhysics(){
    await Rapier.init()
    return new Rapier.World({ x: 0, y: -9.81, z: 0 })
}

export {initPhysics};