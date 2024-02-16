// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import Player from '../../db/model/player'
import PlayerSkill from '../../db/model/playerSkill'

export default async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
  
    let playerName = payload.name;
    let playerPosition = payload.position;
    let playerSkills = payload.playerSkills;
  
    Player.hasMany(PlayerSkill);
    PlayerSkill.belongsTo(Player);
    await Player.findOne({
      where: { id: id }
    }).then(async (player) => {
      return await player.removePlayerSkills(await player.getPlayerSkills());
    });
    
    await Player.findOne({
      where: { id: id }
    }).then(async (player) => {
      await player.update({name: playerName, position: playerPosition});
    });
  
    await Player.findOne({
      where: { id: id }
    }).then(async (player) => {
      await player.addPlayerSkills(await PlayerSkill.bulkCreate(playerSkills));
    });
  
    await Player.findOne({
      where: {name: playerName},
      include: PlayerSkill
    }).then(async (newPlayer) => {
      await res.send(newPlayer);
    });
  } catch (error) {
    await res.json({"message": error})
  }

}
